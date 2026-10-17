/*
 * Startline web platform layer.
 *
 * The app (app.js) asks for a few capabilities through
 * window.claude.use(name): "db" (each person's own documents, with change
 * notifications), "user" (who is signed in) and "downloads" (saving a file).
 * Inside claude.ai those come from the host page. On the open web this file
 * provides them, backed by Supabase: accounts, plus one Postgres table that
 * row-level security keeps private to each account. It also adds what a
 * stand-alone app needs: the sign-in screen, password reset, sign-out,
 * account deletion, installing, and offline support.
 *
 * Saving works offline-first: every account keeps a copy of its documents on
 * the device (IndexedDB), changes are queued on the device and sent when
 * there is a connection, and the app never opens an empty account because
 * the server couldn't be reached.
 */
(() => {
  "use strict";
  const CFG = window.STARTLINE_CONFIG || {};
  const configured = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
  // Read the link we were opened from before the auth client tidies the address bar.
  const urlHash = new URLSearchParams(location.hash.replace(/^#/, ""));
  const recovering = urlHash.get("type") === "recovery";
  const linkError = urlHash.get("error_description") || urlHash.get("error") || "";
  if (linkError) history.replaceState(null, "", location.pathname + location.search);
  let sb = null;
  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
    del: (k) => { try { localStorage.removeItem(k); } catch {} },
  };
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const here = () => location.origin + location.pathname;
  let reloading = false;
  const reload = () => { if (reloading) return; reloading = true; location.reload(); };
  const emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));
  function notice(text) {
    const t = $("#toast"); if (!t) return;
    t.textContent = text; t.hidden = false; setTimeout(() => { t.hidden = true; }, 3500);
  }
  // The sign-in library is only downloaded when accounts are switched on.
  function loadClient() {
    if (window.__startlineCreateClient) return Promise.resolve(window.__startlineCreateClient);
    if (window.supabase && window.supabase.createClient) return Promise.resolve(window.supabase.createClient);
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "vendor/supabase.js?v=dff1e545f4";
      s.onload = () => (window.supabase && window.supabase.createClient ? resolve(window.supabase.createClient) : reject(new Error("no client")));
      s.onerror = () => reject(new Error("couldn't load"));
      document.head.append(s);
    });
  }

  // ---------------------------------------------------------------------------
  // The copy kept on this device: documents as last confirmed by the server,
  // changes still waiting to be sent, and when we last checked. Keyed by
  // account, so two people sharing a device never see each other's work.
  // ---------------------------------------------------------------------------
  function deviceStore(uid) {
    const SEP = "\u0001";
    const key = (p) => uid + SEP + p;
    const range = () => IDBKeyRange.bound(uid + SEP, uid + SEP + "￿");
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((resolve, reject) => {
      if (!window.indexedDB) { reject(new Error("no IndexedDB")); return; }
      const r = indexedDB.open("startline", 1);
      r.onupgradeneeded = () => { const d = r.result; ["docs", "outbox", "meta"].forEach((n) => { if (!d.objectStoreNames.contains(n)) d.createObjectStore(n); }); };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.onblocked = () => reject(new Error("blocked"));
    }));
    const run = (names, mode, fn) => open().then((d) => new Promise((resolve, reject) => {
      const t = d.transaction(names, mode);
      const out = fn(...names.map((n) => t.objectStore(n)));
      t.oncomplete = () => resolve(out);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    }));
    let chain = Promise.resolve();
    const later = (fn) => (chain = chain.then(fn, fn).catch(() => {}));
    const pairs = (keysReq, valsReq) => keysReq.result.map((k, i) => [String(k).slice(uid.length + 1), valsReq.result[i]]);
    return {
      async load() {
        try {
          const r = await run(["docs", "outbox", "meta"], "readonly", (d, o, m) => ({ dk: d.getAllKeys(range()), dv: d.getAll(range()), ok: o.getAllKeys(range()), ov: o.getAll(range()), meta: m.get(uid) }));
          return { docs: new Map(pairs(r.dk, r.dv)), outbox: new Map(pairs(r.ok, r.ov)), meta: r.meta.result || null };
        } catch { return null; }
      },
      queue: (p, v) => later(() => run(["outbox"], "readwrite", (o) => o.put(v, key(p)))),
      unqueue: (p) => later(() => run(["outbox"], "readwrite", (o) => o.delete(key(p)))),
      commit: (list, meta) => later(() => run(["docs", "meta"], "readwrite", (d, m) => {
        list.forEach(([p, v]) => (v === null ? d.delete(key(p)) : d.put(v, key(p))));
        if (meta) m.put(meta, uid);
      })),
      clear: () => later(() => run(["docs", "outbox", "meta"], "readwrite", (d, o, m) => { d.delete(range()); o.delete(range()); m.delete(uid); })),
      idle: () => chain,
    };
  }

  // ---------------------------------------------------------------------------
  // Documents. The app uses paths like "data/users/<id>/desk/tasks/t1"; each
  // row stores the part after "data/users/<id>/".
  // ---------------------------------------------------------------------------
  let syncState = { pending: 0, offline: false };
  function makeDb(uid) {
    const PREFIX = "data/users/" + uid + "/";
    const store = deviceStore(uid);
    const cache = new Map();   // what the app sees: server copy + changes not yet sent
    const server = new Map();  // last copy confirmed by the server
    const pending = new Map(); // path -> { data (null = delete), seq }
    const ver = new Map();     // path -> change counter, for cheap change detection
    const listeners = new Set();
    let seq = 0, lastSeen = null, offline = false, sending = false, pulling = false, retryTimer = null, backoff = 2000, lastAuthTry = 0;
    const rel = (p) => (typeof p === "string" && p.startsWith(PREFIX) && p.length > PREFIX.length ? p.slice(PREFIX.length) : null);
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const setCache = (p, v) => {
      if (v === undefined || v === null) { if (!cache.has(p)) return false; cache.delete(p); }
      else { if (cache.has(p) && same(cache.get(p), v)) return false; cache.set(p, v); }
      ver.set(p, (ver.get(p) || 0) + 1); return true;
    };
    let timer = null;
    const notify = () => { clearTimeout(timer); timer = setTimeout(() => listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }), 0); };
    const status = () => { syncState = { pending: pending.size, offline }; emit("startline:sync", syncState); };
    const transient = (res) => { const s = res && res.status; return !s || s >= 500 || s === 408 || s === 429; };
    const authProblem = (res) => { const s = res && res.status, c = res && res.error && res.error.code; return s === 401 || c === "PGRST301" || c === "PGRST303"; };
    const codeOf = (res) => { const c = res && res.error && res.error.code; return c === "23514" ? "quota_exceeded" : c === "42501" || (res && res.status === 403) ? "not_granted" : "invalid_argument"; };
    const failure = (res) => { const x = new Error((res && res.error && res.error.message) || "unavailable"); x.transient = transient(res) || authProblem(res); return x; };

    // ----- Reading from the server
    async function pages(build) {
      const out = []; let from = 0;
      for (;;) {
        const res = await build().range(from, from + 499);
        if (res.error) throw failure(res);
        out.push(...(res.data || []));
        if (!res.data || res.data.length < 500) return out;
        from += 500;
      }
    }
    // Only what changed since the last check is downloaded; the row count
    // tells us whether anything was deleted (or missed) since then.
    async function pull() {
      if (pulling) return; pulling = true;
      try {
        const since = lastSeen ? new Date(Date.parse(lastSeen) - 5000).toISOString() : null;
        const rows = await pages(() => { let q = sb.from("docs").select("path,data,updated_at").eq("user_id", uid); if (since) q = q.gte("updated_at", since); return q.order("path"); });
        const head = await sb.from("docs").select("path", { count: "exact", head: true }).eq("user_id", uid);
        if (head.error) throw failure(head);
        const known = new Set(server.keys()); rows.forEach((r) => known.add(r.path));
        let all = null;
        if (head.count !== known.size) {
          all = new Set((await pages(() => sb.from("docs").select("path").eq("user_id", uid).order("path"))).map((r) => r.path));
          const have = new Set(rows.map((r) => r.path));
          const missing = [...all].filter((p) => !server.has(p) && !have.has(p));
          for (let i = 0; i < missing.length; i += 100) {
            const res = await sb.from("docs").select("path,data,updated_at").eq("user_id", uid).in("path", missing.slice(i, i + 100));
            if (res.error) throw failure(res);
            rows.push(...(res.data || []));
          }
        }
        applyServer(rows, all);
        offline = false;
      } finally { pulling = false; }
    }
    function applyServer(rows, all) {
      let changed = false; const commits = [];
      rows.forEach((r) => {
        if (!lastSeen || r.updated_at > lastSeen) lastSeen = r.updated_at;
        if (server.has(r.path) && same(server.get(r.path), r.data)) return;
        server.set(r.path, r.data); commits.push([r.path, r.data]);
        if (!pending.has(r.path)) changed = setCache(r.path, r.data) || changed;
      });
      if (all) [...server.keys()].forEach((p) => {
        if (all.has(p)) return;
        server.delete(p); commits.push([p, null]);
        if (!pending.has(p)) changed = setCache(p, undefined) || changed;
      });
      store.commit(commits, { lastSeen, at: Date.now() });
      if (changed) notify();
    }

    // ----- Sending changes
    function scheduleRetry() {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(() => { flush(); }, backoff);
      backoff = Math.min(backoff * 2, 60000);
    }
    function refreshAuth() {
      if (Date.now() - lastAuthTry < 15000) return; lastAuthTry = Date.now();
      sb.auth.refreshSession().then(({ data }) => { if (data && data.session) { session = data.session; flush(); } }).catch(() => {});
    }
    function confirm(items) {
      const commits = [];
      items.forEach((b) => {
        if (b.data === null) server.delete(b.path); else server.set(b.path, b.data);
        commits.push([b.path, b.data]);
        const cur = pending.get(b.path);
        if (cur && cur.seq === b.seq) { pending.delete(b.path); store.unqueue(b.path); }
      });
      store.commit(commits, null);
    }
    function drop(b, code) {
      const cur = pending.get(b.path);
      if (cur && cur.seq === b.seq) {
        pending.delete(b.path); store.unqueue(b.path);
        if (setCache(b.path, server.has(b.path) ? server.get(b.path) : undefined)) notify();
      }
      emit("startline:sync-error", { code });
    }
    async function send(items) {
      const ups = items.filter((b) => b.data !== null), dels = items.filter((b) => b.data === null);
      if (ups.length) {
        const res = await sb.from("docs").upsert(ups.map((b) => ({ user_id: uid, path: b.path, data: b.data })));
        if (res.error || res.status === 0) return res;
        confirm(ups);
      }
      if (dels.length) {
        const res = await sb.from("docs").delete().eq("user_id", uid).in("path", dels.map((b) => b.path));
        if (res.error || res.status === 0) return res;
        confirm(dels);
      }
      return null;
    }
    async function flush() {
      if (sending || !pending.size || !sb) return;
      sending = true; clearTimeout(retryTimer);
      try {
        while (pending.size) {
          const batch = [...pending.entries()].slice(0, 50).map(([path, e]) => ({ path, data: e.data, seq: e.seq }));
          let res;
          try { res = await send(batch); } catch { res = { status: 0, error: { message: "network" } }; }
          if (!res) { offline = false; backoff = 2000; continue; }
          if (transient(res) || authProblem(res)) { offline = true; if (authProblem(res)) refreshAuth(); scheduleRetry(); return; }
          // A change the server will never accept: find which one, undo it, carry on.
          for (const b of batch) {
            if (!pending.has(b.path) || pending.get(b.path).seq !== b.seq) continue;
            let one;
            try { one = await send([b]); } catch { one = { status: 0, error: {} }; }
            if (!one) continue;
            if (transient(one) || authProblem(one)) { offline = true; scheduleRetry(); return; }
            drop(b, codeOf(one));
          }
        }
      } finally { sending = false; status(); }
    }

    // ----- What the app calls
    async function write(p, data) {
      const r = rel(p);
      if (r == null) { const e = new Error("Path outside your account"); e.code = "invalid_argument"; throw e; }
      const v = data === undefined ? null : JSON.parse(JSON.stringify(data));
      pending.set(r, { data: v, seq: ++seq });
      if (setCache(r, v)) notify();
      store.queue(r, v);
      status();
      flush();
    }
    const snapOf = (r) => ({ id: r.split("/").pop(), exists: cache.has(r), data: () => (cache.has(r) ? JSON.parse(JSON.stringify(cache.get(r))) : undefined), metadata: {} });
    function watch(compute, next) {
      let last = null;
      const fn = () => { const s = compute(); if (s.key === last) return; last = s.key; next(s.snap()); };
      listeners.add(fn); setTimeout(fn, 0);
      return () => listeners.delete(fn);
    }
    function docRef(p) {
      const r = rel(p);
      return {
        id: String(p).split("/").pop(), path: p,
        set: (data) => write(p, data),
        update: (data) => write(p, Object.assign({}, r != null ? cache.get(r) : null, data)),
        delete: () => write(p, undefined),
        get: async () => snapOf(r),
        onSnapshot: (next) => watch(() => ({ key: (cache.has(r) ? "1:" : "0:") + (ver.get(r) || 0), snap: () => snapOf(r) }), next),
        collection: (c) => colRef(p + "/" + c),
      };
    }
    function colRef(p) {
      const r = rel(p);
      const keys = () => [...cache.keys()].filter((k) => k.startsWith(r + "/") && !k.slice(r.length + 1).includes("/")).sort();
      return {
        path: p, doc: (id) => docRef(p + "/" + id),
        onSnapshot: (next) => watch(() => {
          const ks = keys();
          return { key: ks.map((k) => k + ":" + (ver.get(k) || 0)).join("|"), snap: () => { const list = ks.map(snapOf); return { docs: list, size: list.length, empty: !list.length, docChanges: () => [], metadata: {} }; } };
        }, next),
      };
    }

    // Check for changes from other devices: when you come back to the app,
    // when the connection returns, and every 30 seconds while it's open.
    const check = () => {
      if (document.visibilityState !== "visible") return;
      flush();
      if (!sending) pull().then(() => { status(); }, (e) => { if (e && e.transient) { offline = true; status(); } });
    };
    document.addEventListener("visibilitychange", check);
    window.addEventListener("online", () => { backoff = 2000; refreshAuth(); check(); });
    window.addEventListener("focus", check);
    setInterval(check, 30000);

    const ready = (async () => {
      const snap = await store.load();
      if (snap) {
        snap.docs.forEach((v, k) => { server.set(k, v); cache.set(k, v); });
        snap.outbox.forEach((v, k) => { pending.set(k, { data: v, seq: ++seq }); setCache(k, v); });
        lastSeen = snap.meta && snap.meta.lastSeen ? snap.meta.lastSeen : null;
      }
      const hasCopy = !!(snap && snap.meta);
      if (hasCopy) {
        // Open straight away with the copy on this device; catch up with the server in the background.
        pull().then(() => { status(); flush(); }, (e) => { offline = !!(e && e.transient) || offline; status(); flush(); });
        status();
        return { fromDevice: true };
      }
      await pull(); // No copy yet: never open an empty account. If this fails, the caller shows "Can't reach your account".
      status(); flush();
      return { fromDevice: false };
    })();
    return {
      ready,
      api: Object.freeze({ doc: docRef, collection: colRef }),
      flush, pendingCount: () => pending.size, offline: () => offline,
      clear: async () => { await store.idle(); await store.clear(); await store.idle(); },
    };
  }

  // ---------------------------------------------------------------------------
  // The sign-in screen
  // ---------------------------------------------------------------------------
  let session = null, currentDb = null;
  let gateResolve, gateDone = false;
  const gate = new Promise((r) => (gateResolve = r));
  const openGate = (v) => { if (gateDone) return; gateDone = true; gateResolve(v); };
  let lockedByAuth = false;
  function lockApp(locked) {
    lockedByAuth = locked;
    [".wrap", "#bnav"].forEach((s) => { const n = $(s); if (n) n.inert = locked; });
    if (locked) document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  }
  const standalone = () => (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const TITLES = { signin: "Sign in", signup: "Create your free account", reset: "Reset your password", newpass: "Choose a new password", check: "Check your email", unreachable: "Can't reach your account" };
  const BUTTONS = { signin: "Sign in", signup: "Create account", reset: "Send reset link" };
  function friendly(er) {
    const m = String((er && er.message) || "");
    if (/invalid login|invalid credentials/i.test(m)) return "That email and password don't match. Check them, or reset your password.";
    if (/not confirmed/i.test(m)) return "Confirm your email first: open the link we sent you, then sign in.";
    if (/already registered|already been registered|already exists/i.test(m)) return "There's already an account with this email. Sign in instead.";
    if (/rate limit|too many|security purposes/i.test(m)) return "Too many tries. Wait a minute, then try again.";
    if (/weak|pwned|leaked/i.test(m)) return "Choose a stronger password: longer, and not one used on other sites.";
    if (/not authorized|signups not allowed|signup is disabled/i.test(m)) return "New accounts can't be created on this site right now.";
    if (/fetch|network|load failed|couldn't load/i.test(m)) return "Can't reach the server. Check your connection and try again.";
    return m || "That didn't work. Try again.";
  }
  // Views that may be closed to go back to the app (the person opened them).
  const closable = (view) => gateDone && !["newpass", "unreachable"].includes(view);
  function authScreen(view = "signin", note = "") {
    let box = $("#auth");
    if (!box) {
      box = el("div", "auth"); box.id = "auth";
      box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "authTitle");
      box.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.dataset.closable === "1") { e.preventDefault(); closeAuth(); } });
      document.body.append(box);
    }
    box.dataset.closable = closable(view) ? "1" : "";
    lockApp(true);
    box.textContent = "";
    const card = el("div", "auth-card");
    const logo = $(".logo");
    if (logo) {
      const l = logo.cloneNode(true); l.removeAttribute("id");
      const h1 = l.querySelector("h1"); if (h1) h1.replaceWith(el("span", "auth-brand", "Startline"));
      card.append(l);
    }
    const h = el("h2", null, TITLES[view]); h.id = "authTitle"; h.tabIndex = -1; card.append(h);
    if (view === "signin" || view === "signup") {
      const seg = el("div", "seg auth-seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Sign in or create an account");
      [["signin", "Sign in"], ["signup", "Create account"]].forEach(([k, l]) => {
        const b = el("button", null, l); b.type = "button"; b.setAttribute("aria-pressed", String(view === k)); b.onclick = () => authScreen(k); seg.append(b);
      });
      card.append(seg);
      if (view === "signup") card.append(el("p", "small muted", "Free. Your plan, tasks and saves follow you to every device where you sign in."));
    }
    if (note) card.append(el("p", "small auth-note", note));
    const msg = el("p", "small auth-msg"); msg.setAttribute("role", "alert");
    const field = (id, label, type, auto, extra = {}) => {
      const f = el("div", "field"); const lab = el("label", "label", label); lab.htmlFor = id;
      const i = el("input"); i.type = type; i.id = id; i.autocomplete = auto; Object.assign(i, extra);
      f.append(lab, i); return [f, i];
    };
    if (view === "signin" || view === "signup" || view === "reset") {
      const form = el("form", "auth-form"); form.noValidate = true;
      let nameIn = null, passIn = null, ageIn = null;
      if (view === "signup") { const [f, i] = field("authName", "Your name (optional)", "text", "nickname", { maxLength: 60 }); nameIn = i; form.append(f); }
      const [fe, emailIn] = field("authEmail", "Email", "email", "email", { required: true, inputMode: "email", spellcheck: false });
      form.append(fe);
      if (view !== "reset") {
        const [fp, i] = field("authPass", view === "signup" ? "Password (at least 8 characters)" : "Password", "password", view === "signup" ? "new-password" : "current-password", { required: true, minLength: 8 });
        passIn = i; form.append(fp);
      }
      if (view === "signup") {
        const w = el("div", "field toggle auth-age");
        ageIn = el("input"); ageIn.type = "checkbox"; ageIn.id = "authAge";
        const l = el("label", null, "I'm 16 or older, and I agree to the "); l.htmlFor = "authAge";
        const tl = el("a", null, "terms"); tl.href = "terms.html"; tl.target = "_blank"; tl.rel = "noopener";
        const pl = el("a", null, "privacy policy"); pl.href = "privacy.html"; pl.target = "_blank"; pl.rel = "noopener";
        l.append(tl, " and ", pl, ".");
        w.append(ageIn, l); form.append(w);
      }
      const go = el("button", "btn primary", BUTTONS[view]); go.type = "submit";
      form.append(go, msg);
      form.addEventListener("submit", async (e) => {
        e.preventDefault(); msg.textContent = "";
        const email = emailIn.value.trim(), pass = passIn ? passIn.value : "";
        if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = "Enter your email address."; emailIn.focus(); return; }
        if (passIn && pass.length < 8) { msg.textContent = view === "signup" ? "Use at least 8 characters for your password." : "Enter your password."; passIn.focus(); return; }
        if (ageIn && !ageIn.checked) { msg.textContent = "To create an account, confirm you're 16 or older and agree to the terms."; ageIn.focus(); return; }
        go.disabled = true; go.textContent = view === "reset" ? "Sending…" : "One moment…";
        try {
          if (view === "signin") {
            const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
            if (error) throw error;
            await signedIn(data.session);
          } else if (view === "signup") {
            const name = nameIn.value.trim().slice(0, 60);
            const { data, error } = await sb.auth.signUp({ email, password: pass, options: { data: name ? { display_name: name } : {}, emailRedirectTo: here() } });
            if (error) throw error;
            if (data.session) await signedIn(data.session);
            // With email confirmation on, Supabase answers the same way whether or
            // not the email already has an account, so the message covers both.
            else if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) authScreen("check", "If " + email + " doesn't have an account yet, we sent it a link to confirm. If you already have one, sign in or reset your password.");
            else authScreen("check", "We sent a link to " + email + ". Open it to confirm your account. If it doesn't arrive in a few minutes, check your spam folder.");
          } else {
            const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: here() });
            if (error) throw error;
            authScreen("check", "If there's an account for " + email + ", we sent it a link to choose a new password.");
          }
        } catch (er) {
          go.disabled = false; go.textContent = BUTTONS[view];
          msg.textContent = friendly(er);
        }
      });
      card.append(form);
      if (view === "signin") { const fg = el("button", "linkish", "Forgot your password?"); fg.type = "button"; fg.onclick = () => authScreen("reset"); card.append(fg); }
      if (view === "reset") { const back = el("button", "linkish", "Back to sign in"); back.type = "button"; back.onclick = () => authScreen("signin"); card.append(back); }
      // Google sends people back to the browser, not to an app installed on iPhone, so it's only offered elsewhere.
      if (CFG.googleSignIn && view !== "reset" && !(isIOS() && standalone())) {
        card.append(el("div", "auth-or", "or"));
        const g = el("button", "btn", "Continue with Google"); g.type = "button";
        g.onclick = async () => {
          try {
            const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: here() } });
            if (error) throw error;
          } catch { msg.textContent = "Google sign-in isn't available right now. Try email instead."; }
        };
        card.append(g);
      }
    } else if (view === "newpass") {
      const form = el("form", "auth-form"); form.noValidate = true;
      const [fp, passIn] = field("authNewPass", "New password (at least 8 characters)", "password", "new-password", { minLength: 8 });
      const go = el("button", "btn primary", "Save new password"); go.type = "submit";
      form.append(fp, go, msg);
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (passIn.value.length < 8) { msg.textContent = "Use at least 8 characters."; passIn.focus(); return; }
        go.disabled = true; go.textContent = "Saving…";
        const { error } = await sb.auth.updateUser({ password: passIn.value });
        if (error) { go.disabled = false; go.textContent = "Save new password"; msg.textContent = friendly(error); return; }
        const { data } = await sb.auth.getSession();
        await signedIn((data && data.session) || session);
        notice("Your password was changed.");
      });
      card.append(form);
    } else if (view === "check") {
      const back = el("button", "btn", "Back to sign in"); back.type = "button"; back.onclick = () => authScreen("signin"); card.append(back);
    } else if (view === "unreachable") {
      card.append(el("p", null, "Startline couldn't load your account, so it hasn't opened it. Nothing in your account was changed."));
      card.append(el("p", "small muted", "Check your connection and try again. If it keeps happening, the service may be paused or down for a while."));
      const row = el("div", "auth-actions");
      const again = el("button", "btn primary", "Try again"); again.type = "button";
      again.onclick = () => { again.disabled = true; again.textContent = "Trying…"; signedIn(session); };
      const out = el("button", "btn", "Sign out"); out.type = "button";
      out.onclick = () => { platform.signOut({ force: true }); };
      row.append(again, out); card.append(row);
    }
    if (closable(view)) {
      const guest = el("div", "auth-guest");
      const gb = el("button", "linkish", "Not now"); gb.type = "button";
      gb.onclick = () => closeAuth();
      guest.append(gb, el("span", "small muted", "Keep using Startline without an account. Your work stays in this browser."));
      card.append(guest);
    }
    box.append(card);
    const first = card.querySelector("input") || card.querySelector(".auth-actions button") || h;
    // Don't pull the cursor back if someone has already moved into the form.
    setTimeout(() => { if (first.isConnected && !card.contains(document.activeElement)) first.focus(); }, 30);
  }
  function closeAuth() { const box = $("#auth"); if (box) box.remove(); lockApp(false); }
  async function signedIn(s) {
    session = s;
    // Already running without an account: start again, signed in.
    if (gateDone) { reload(); return; }
    const db = makeDb(s.user.id);
    try {
      const how = await db.ready;
      currentDb = db;
      closeAuth();
      openGate({ db: db.api, uid: s.user.id, fromDevice: how.fromDevice });
    } catch {
      authScreen("unreachable");
    }
  }
  // Offline with an expired sign-in: the session is still stored on the device
  // (supabase-js keeps it when a refresh fails for lack of a connection).
  function storedSession() {
    try {
      const k = (sb.auth && sb.auth.storageKey) || "sb-" + new URL(CFG.supabaseUrl).hostname.split(".")[0] + "-auth-token";
      const v = JSON.parse(localStorage.getItem(k) || "null");
      const s = v && (v.currentSession || v);
      return s && s.user && s.user.id && s.refresh_token ? s : null;
    } catch { return null; }
  }

  async function boot() {
    if (!configured) { openGate(null); return; }
    try { const createClient = await loadClient(); sb = createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }); }
    catch { openGate(null); return; }
    sb.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") { session = s; if (!$("#authNewPass")) authScreen("newpass"); }
      else if (event === "SIGNED_OUT" && gateDone && session) reload();
      else if (s) { session = s; if (currentDb && event === "TOKEN_REFRESHED") currentDb.flush(); }
    });
    let s = null;
    try { const { data } = await sb.auth.getSession(); s = data && data.session; } catch {}
    if (recovering && s) { session = s; authScreen("newpass"); return; }
    if (s) { await signedIn(s); return; }
    const kept = storedSession();
    if (kept && !navigator.onLine) { await signedIn(kept); return; }
    // Everyone starts in the app; signing in is offered from there.
    openGate(null);
    if (linkError) authScreen("signin", /expired|invalid/i.test(linkError) ? "That link has expired or was already used. Sign in, or ask for a new link." : "That link didn't work: " + linkError);
  }

  // ---------------------------------------------------------------------------
  // The capabilities the app asks for
  // ---------------------------------------------------------------------------
  const downloads = Object.freeze({
    save: async ({ filename, data }) => {
      const type = /\.json$/i.test(filename) ? "application/json" : /\.ics$/i.test(filename) ? "text/calendar" : /\.csv$/i.test(filename) ? "text/csv" : "text/plain";
      const blob = data instanceof Blob ? data : new Blob([data], { type });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename;
      document.body.append(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return { status: "saved" };
    },
  });
  function userApi(g) {
    const meta = () => (session && session.user && session.user.user_metadata) || {};
    return Object.freeze({
      id: async () => g.uid,
      me: async () => ({ id: g.uid, name: typeof meta().display_name === "string" ? meta().display_name : "" }),
      can: async () => true,
    });
  }
  window.claude = Object.freeze({
    use: async (name) => {
      if (name === "downloads") return downloads;
      if (name === "db" || name === "user") {
        const g = await gate;
        if (!g) return null;
        return name === "db" ? g.db : userApi(g);
      }
      return null; // AI inside claude.ai ("sample") isn't available on the open web
    },
  });

  // ---------------------------------------------------------------------------
  // What the app uses when it runs as a web app
  // ---------------------------------------------------------------------------
  let installEvent = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvent = e; emit("startline:install"); });
  window.addEventListener("appinstalled", () => { installEvent = null; emit("startline:install"); });
  async function endSession() {
    reloading = true;
    try { await sb.auth.signOut({ scope: "local" }); } catch {}
    try { if (currentDb) await currentDb.clear(); } catch {}
    try { Object.keys(localStorage).filter((k) => /^sb-.*-auth-token/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch {}
    // Things typed into the tools stay on a shared computer otherwise.
    ["dd-calc2", "dd-recent"].forEach(ls.del);
    location.reload();
  }
  const platform = Object.freeze({
    accounts: configured,
    email: () => (session && session.user && session.user.email) || "",
    showAuth: (view) => { if (sb) authScreen(view || "signup"); },
    pendingCount: () => (currentDb ? currentDb.pendingCount() : 0),
    syncState: () => syncState,
    retrySync: () => { if (currentDb) currentDb.flush(); },
    signOut: async (opts = {}) => {
      if (!opts.force && currentDb && currentDb.pendingCount()) return { pending: currentDb.pendingCount() };
      await endSession();
      return { done: true };
    },
    deleteAccount: async () => {
      const { error } = await sb.rpc("delete_my_account");
      if (error) throw error;
      await endSession();
    },
    // Cookieless visit counts (config.analytics): only a page path or event name is sent, never anything typed.
    track: (name) => {
      const A = CFG.analytics || {};
      if (A.provider !== "goatcounter" || !/^[a-z0-9-]+$/i.test(A.code || "")) return;
      new Image().src = "https://" + A.code + ".goatcounter.com/count?p=" + encodeURIComponent(name) + (name.startsWith("/") ? "" : "&e=true") + "&rnd=" + Date.now().toString(36);
    },
    // Anonymous feedback (supabase/schema.sql: an insert-only table), or an email address to write to.
    canSendFeedback: () => !!sb,
    sendFeedback: async (row) => { const { error } = await sb.from("feedback").insert(row); if (error) throw error; },
    contactEmail: () => (typeof CFG.contactEmail === "string" && /^[^@\s]+@[^@\s]+$/.test(CFG.contactEmail) ? CFG.contactEmail : ""),
    canInstall: () => !standalone() && (!!installEvent || isIOS()),
    isIOS, standalone,
    install: async () => {
      if (installEvent) {
        const ev = installEvent; installEvent = null;
        ev.prompt();
        const r = await ev.userChoice.catch(() => null);
        return r && r.outcome === "accepted" ? "installed" : "dismissed";
      }
      return isIOS() ? "ios" : "unavailable";
    },
  });
  window.startlinePlatform = platform;
  platform.track(location.pathname || "/");

  // Offline support and updates (service workers need https or localhost).
  const swOk = "serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1");
  if (swOk && !window.__startlineNoSw) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then((reg) => {
        const offer = (w) => {
          if (!w || $(".update-bar")) return;
          const bar = el("div", "update-bar"); bar.setAttribute("role", "status");
          bar.append(el("span", null, "A new version of Startline is ready."));
          const b = el("button", "btn sm primary", "Reload"); b.type = "button";
          b.onclick = () => { b.disabled = true; w.postMessage("skipWaiting"); };
          bar.append(b); document.body.append(bar);
        };
        if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const w = reg.installing; if (!w) return;
          w.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) offer(w); });
        });
        const look = () => reg.update().catch(() => {});
        setInterval(look, 60 * 60 * 1000);
        document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") look(); });
      }).catch(() => {});
      let had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (had) reload(); had = true; });
    });
  }
  // A sign-in or reset link pasted into a tab that already has the app open.
  window.addEventListener("hashchange", () => { if (/(^|[#&])(access_token|error_description)=/.test(location.hash)) reload(); });
  boot();
})();
