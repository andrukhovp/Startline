// A small stand-in for a Supabase project, for tests only. It answers the
// Auth and REST requests the real supabase-js client makes, and runs every
// database request through Postgres (PGlite) with the real schema.sql and
// row-level security, as the "authenticated" or "anon" role.
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const unb64 = (s) => { try { return JSON.parse(Buffer.from(s, "base64url").toString()); } catch { return null; } };

export async function createMiniSupabase(schemaPath) {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin; create role authenticated nologin;
    create schema auth;
    create table auth.users (id uuid primary key, email text unique, password text, confirmed boolean, meta jsonb default '{}'::jsonb, created_at timestamptz default now());
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
    grant usage on schema public to anon, authenticated;
  `);
  await db.exec(readFileSync(schemaPath, "utf8"));
  const state = { confirmEmail: false, outbox: [], failNext: null, requests: [], refresh: new Map(), siteUrl: "", down: false, restDown: false, slowMs: 0 };

  const userJson = (u) => ({ id: u.id, aud: "authenticated", role: "authenticated", email: u.email, email_confirmed_at: u.confirmed ? new Date().toISOString() : null, user_metadata: u.meta || {}, app_metadata: { provider: "email", providers: ["email"] }, identities: [{ provider: "email", identity_id: u.id }], created_at: u.created_at, updated_at: new Date().toISOString() });
  const sessionFor = (u) => {
    const now = Math.floor(Date.now() / 1000);
    const access_token = b64({ alg: "HS256", typ: "JWT" }) + "." + b64({ sub: u.id, email: u.email, role: "authenticated", aud: "authenticated", iat: now, exp: now + 3600, session_id: randomUUID() }) + ".sig";
    const refresh_token = randomUUID();
    state.refresh.set(refresh_token, u.id);
    return { access_token, token_type: "bearer", expires_in: 3600, expires_at: now + 3600, refresh_token, user: userJson(u) };
  };
  const linkFor = (u, type, redirect) => {
    const s = sessionFor(u);
    return (redirect || state.siteUrl) + "#" + new URLSearchParams({ access_token: s.access_token, expires_at: String(s.expires_at), expires_in: "3600", refresh_token: s.refresh_token, token_type: "bearer", type }).toString();
  };
  const userById = async (id) => (await db.query("select * from auth.users where id = $1", [id])).rows[0] || null;
  const userByEmail = async (email) => (await db.query("select * from auth.users where lower(email) = lower($1)", [email])).rows[0] || null;
  const bearerUser = async (headers) => {
    const tok = (headers.authorization || "").replace(/^Bearer /, "");
    const p = unb64(tok.split(".")[1] || "");
    if (!p || !p.sub || p.exp < Date.now() / 1000) return null;
    return userById(p.sub);
  };
  const json = (status, body, extra = {}) => ({ status, headers: { "content-type": "application/json", "x-supabase-api-version": "2024-01-01", ...extra }, body: body === undefined ? "" : JSON.stringify(body) });
  const authErr = (status, code, message) => json(status, { code, message });

  async function auth(method, url, headers, body) {
    const p = url.pathname.replace(/^\/auth\/v1/, "");
    const redirect = url.searchParams.get("redirect_to") || "";
    if (p === "/signup" && method === "POST") {
      const existing = await userByEmail(body.email);
      // Like Supabase: with confirmations on, an existing email gets a look-alike answer with no identities.
      if (existing && state.confirmEmail) return json(200, { ...userJson(existing), id: randomUUID(), identities: [] });
      if (existing) return authErr(422, "user_already_exists", "User already registered");
      if (!body.password || body.password.length < 6) return authErr(422, "weak_password", "Password should be at least 6 characters.");
      const id = randomUUID();
      await db.query("insert into auth.users (id, email, password, confirmed, meta) values ($1, $2, $3, $4, $5)", [id, body.email, body.password, !state.confirmEmail, JSON.stringify(body.data || {})]);
      const u = await userById(id);
      if (state.confirmEmail) { state.outbox.push({ type: "signup", to: u.email, link: linkFor(u, "signup", redirect) }); return json(200, userJson(u)); }
      return json(200, sessionFor(u));
    }
    if (p === "/token" && method === "POST") {
      const grant = url.searchParams.get("grant_type");
      if (grant === "password") {
        const u = await userByEmail(body.email || "");
        if (!u || u.password !== body.password) return authErr(400, "invalid_credentials", "Invalid login credentials");
        if (!u.confirmed) return authErr(400, "email_not_confirmed", "Email not confirmed");
        return json(200, sessionFor(u));
      }
      if (grant === "refresh_token") {
        const id = state.refresh.get(body.refresh_token); const u = id && (await userById(id));
        if (!u) return authErr(400, "refresh_token_not_found", "Invalid Refresh Token: Refresh Token Not Found");
        return json(200, sessionFor(u));
      }
    }
    if (p === "/user" && method === "GET") {
      const u = await bearerUser(headers);
      return u ? json(200, userJson(u)) : authErr(403, "user_not_found", "User from sub claim in JWT does not exist");
    }
    if (p === "/user" && method === "PUT") {
      const u = await bearerUser(headers);
      if (!u) return authErr(403, "user_not_found", "User from sub claim in JWT does not exist");
      if (body.password) await db.query("update auth.users set password = $2 where id = $1", [u.id, body.password]);
      if (body.data) await db.query("update auth.users set meta = meta || $2::jsonb where id = $1", [u.id, JSON.stringify(body.data)]);
      return json(200, userJson(await userById(u.id)));
    }
    if (p === "/recover" && method === "POST") {
      const u = await userByEmail(body.email || "");
      if (u) state.outbox.push({ type: "recovery", to: u.email, link: linkFor(u, "recovery", redirect) });
      return json(200, {});
    }
    if (p === "/logout" && method === "POST") return { status: 204, headers: {}, body: "" };
    return authErr(404, "not_found", "Not found: " + method + " " + p);
  }

  const COLS = new Set(["user_id", "path", "data", "updated_at"]);
  const pgErr = (e, anon) => {
    const status = e.code === "42501" ? (anon ? 401 : 403) : e.code === "23514" || e.code === "23505" || e.code === "22P02" ? 400 : 400;
    return { status, headers: { "content-type": "application/json" }, body: JSON.stringify({ code: e.code || "XX000", message: e.message, details: null, hint: null }) };
  };
  async function asRole(headers, fn) {
    const u = await bearerUser(headers);
    const anon = !u;
    try {
      const out = await db.transaction(async (tx) => {
        await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [u ? u.id : ""]);
        await tx.exec(anon ? "set local role anon" : "set local role authenticated");
        return fn(tx);
      });
      return out;
    } catch (e) { return pgErr(e, anon); }
  }
  const splitList = (txt) => { const out = []; let cur = "", q = false; for (const ch of txt) { if (ch === '"') { q = !q; continue; } if (ch === "," && !q) { out.push(cur); cur = ""; continue; } cur += ch; } if (txt.length) out.push(cur); return out; };
  function where(url, params) {
    const conds = [];
    for (const [k, v] of url.searchParams) {
      if (!COLS.has(k)) continue;
      const cast = k === "updated_at" ? "::timestamptz" : k === "user_id" ? "::uuid" : "";
      let m;
      if ((m = /^eq\.(.*)$/s.exec(v))) { params.push(m[1]); conds.push(`${k} = $${params.length}${cast}`); }
      else if ((m = /^(gte|gt|lte|lt)\.(.*)$/s.exec(v))) { params.push(m[2]); conds.push(`${k} ${{ gte: ">=", gt: ">", lte: "<=", lt: "<" }[m[1]]} $${params.length}${cast}`); }
      else if ((m = /^in\.\((.*)\)$/s.exec(v))) { params.push(splitList(m[1])); conds.push(`${k}${k === "path" ? "" : "::text"} = any($${params.length}::text[])`); }
      else throw Object.assign(new Error("unsupported filter " + v), { code: "PGRST100" });
    }
    return conds.length ? " where " + conds.join(" and ") : "";
  }
  async function rest(method, url, headers, raw) {
    const prefer = headers.prefer || "";
    if (state.failNext && method !== "GET") { const f = state.failNext; state.failNext = null; return { status: f.status, headers: { "content-type": "application/json" }, body: JSON.stringify({ code: f.code, message: f.message }) }; }
    if (url.pathname === "/rest/v1/rpc/delete_my_account" && method === "POST") {
      return asRole(headers, async (tx) => { await tx.query("select public.delete_my_account()"); return { status: 204, headers: {}, body: "" }; });
    }
    if (url.pathname !== "/rest/v1/docs") return { status: 404, headers: {}, body: "{}" };
    return asRole(headers, async (tx) => {
      if (method === "GET" || method === "HEAD") {
        const cols = (url.searchParams.get("select") || "*").split(",").filter((c) => c === "*" || COLS.has(c));
        const params = []; let sql = `select ${cols.join(", ")} from public.docs` + where(url, params);
        const order = url.searchParams.get("order");
        if (order) sql += " order by " + order.split(",").map((o) => { const [c, dir] = o.split("."); if (!COLS.has(c)) throw new Error("bad order"); return c + (dir === "desc" ? " desc" : " asc"); }).join(", ");
        const limit = url.searchParams.get("limit"), offset = url.searchParams.get("offset");
        if (limit) sql += " limit " + parseInt(limit, 10);
        if (offset) sql += " offset " + parseInt(offset, 10);
        const rows = (await tx.query(sql, params)).rows.map((r) => (r.updated_at instanceof Date ? { ...r, updated_at: r.updated_at.toISOString() } : r));
        const extra = { "content-type": "application/json" };
        if (/count=exact/.test(prefer)) {
          const p2 = []; const n = (await tx.query("select count(*)::int as n from public.docs" + where(url, p2), p2)).rows[0].n;
          const from = parseInt(offset || "0", 10);
          extra["content-range"] = (rows.length ? from + "-" + (from + rows.length - 1) : "*") + "/" + n;
        }
        return { status: 200, headers: extra, body: method === "HEAD" ? "" : JSON.stringify(rows) };
      }
      if (method === "POST") {
        const body = JSON.parse(raw || "null"); const list = Array.isArray(body) ? body : [body];
        for (const row of list) {
          const keys = Object.keys(row).filter((k) => COLS.has(k));
          const vals = keys.map((k) => (k === "data" ? JSON.stringify(row[k]) : row[k]));
          const ph = keys.map((k, i) => "$" + (i + 1) + (k === "data" ? "::jsonb" : ""));
          let sql = `insert into public.docs (${keys.join(", ")}) values (${ph.join(", ")})`;
          if (/resolution=merge-duplicates/.test(prefer)) sql += " on conflict (user_id, path) do update set " + keys.filter((k) => k !== "user_id" && k !== "path").map((k) => `${k} = excluded.${k}`).join(", ");
          await tx.query(sql, vals);
        }
        return { status: 201, headers: {}, body: "" };
      }
      if (method === "DELETE") {
        const params = []; const w = where(url, params);
        if (!w) throw Object.assign(new Error("DELETE requires a filter"), { code: "21000" });
        await tx.query("delete from public.docs" + w, params);
        return { status: 204, headers: {}, body: "" };
      }
      return { status: 405, headers: {}, body: "" };
    });
  }

  const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD", "access-control-expose-headers": "content-range, x-supabase-api-version" };
  async function handle(route) {
    const req = route.request();
    const url = new URL(req.url());
    const method = req.method();
    if (method === "OPTIONS") return route.fulfill({ status: 200, headers: CORS, body: "" });
    // Simulated outages: the whole service, or just the database.
    if (state.down || (state.restDown && url.pathname.startsWith("/rest/"))) return route.abort("internetdisconnected");
    if (state.slowMs) await new Promise((r) => setTimeout(r, state.slowMs));
    const headers = req.headers();
    const raw = req.postData();
    state.requests.push({ method, path: url.pathname + url.search, prefer: headers.prefer || "", apikey: headers.apikey || "", auth: headers.authorization ? "bearer" : "" });
    let out;
    try {
      out = url.pathname.startsWith("/auth/v1/") ? await auth(method, url, headers, raw ? JSON.parse(raw) : {}) : await rest(method, url, headers, raw);
    } catch (e) { out = { status: 500, headers: { "content-type": "application/json" }, body: JSON.stringify({ message: String(e.message || e) }) }; }
    return route.fulfill({ status: out.status, headers: { ...CORS, ...out.headers }, body: out.body });
  }
  return { db, state, handle, userByEmail, rows: async (sql, p) => (await db.query(sql, p)).rows };
}
