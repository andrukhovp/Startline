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
  const createClient = window.__startlineCreateClient || (window.supabase && window.supabase.createClient);
  const sb = configured && createClient ? createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
  const GUEST_KEY = "sl-guest";
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
  function notice(text) {
    const t = $("#toast"); if (!t) return;
    t.textContent = text; t.hidden = false; setTimeout(() => { t.hidden = true; }, 3500);
  }

  // ---------------------------------------------------------------------------
  // Documents. The app uses paths like "data/users/<id>/desk/tasks/t1"; each
  // row stores the part after "data/users/<id>/". All of this person's rows
  // are kept in memory, so reads are instant and work offline; writes go to
  // the server straight away and are undone on screen if they fail.
  // ---------------------------------------------------------------------------
  function makeDb(uid) {
    const PREFIX = "data/users/" + uid + "/";
    const cache = new Map();
    const listeners = new Set();
    const rel = (p) => (typeof p === "string" && p.startsWith(PREFIX) && p.length > PREFIX.length ? p.slice(PREFIX.length) : null);
    const fail = (e, code) => {
      const status = e && (e.status || e.statusCode);
      const c = code || (e && (e.code === "42501" || status === 401 || status === 403) ? "not_granted" : e && e.code === "23514" ? "quota_exceeded" : "unavailable");
      const x = new Error((e && e.message) || c); x.code = c; return x;
    };
    let timer = null;
    const notify = () => { clearTimeout(timer); timer = setTimeout(() => listeners.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } }), 0); };
    let writes = 0, inFlight = 0, stamp = null;
    async function fetchAll() {
      const fresh = new Map(); let from = 0;
      for (;;) {
        const { data, error } = await sb.from("docs").select("path,data").eq("user_id", uid).order("path").range(from, from + 999);
        if (error) throw fail(error);
        (data || []).forEach((r) => fresh.set(r.path, r.data));
        if (!data || data.length < 1000) break;
        from += 1000;
      }
      return fresh;
    }
    // Load everything, unless one of our own writes happened meanwhile (the
    // copy on screen is then newer than what came back).
    async function loadAll() {
      const before = writes;
      const fresh = await fetchAll();
      if (before !== writes || inFlight) return false;
      cache.clear(); fresh.forEach((v, k) => cache.set(k, v)); notify();
      return true;
    }
    // A cheap check for changes made on another device: the row count and the
    // newest change time. Only when either moved is everything fetched again.
    async function checkForChanges() {
      if (inFlight) return;
      const { data, count, error } = await sb.from("docs").select("updated_at", { count: "exact" }).eq("user_id", uid).order("updated_at", { ascending: false }).limit(1);
      if (error) return;
      const next = (count || 0) + "|" + ((data && data[0] && data[0].updated_at) || "");
      if (stamp !== null && next !== stamp && (await loadAll().catch(() => false)) === false) return;
      stamp = next;
    }
    async function write(p, data) {
      const r = rel(p); if (r == null) throw fail(null, "invalid_argument");
      const prev = cache.has(r) ? cache.get(r) : undefined;
      if (data === undefined) cache.delete(r); else cache.set(r, JSON.parse(JSON.stringify(data)));
      writes++; inFlight++; notify();
      try {
        const { error } = data === undefined
          ? await sb.from("docs").delete().eq("user_id", uid).eq("path", r)
          : await sb.from("docs").upsert({ user_id: uid, path: r, data: cache.get(r) });
        if (error) { if (prev === undefined) cache.delete(r); else cache.set(r, prev); notify(); throw fail(error); }
      } finally { inFlight--; }
    }
    const snapOf = (r) => ({ id: r.split("/").pop(), exists: cache.has(r), data: () => (cache.has(r) ? JSON.parse(JSON.stringify(cache.get(r))) : undefined), metadata: {} });
    function watch(compute, next) {
      let last = null;
      const fn = () => { const s = compute(); if (s.key === last) return; last = s.key; next(s.snap); };
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
        onSnapshot: (next) => watch(() => ({ key: JSON.stringify(cache.has(r) ? cache.get(r) : null), snap: snapOf(r) }), next),
        collection: (c) => colRef(p + "/" + c),
      };
    }
    function colRef(p) {
      const r = rel(p);
      const keys = () => [...cache.keys()].filter((k) => k.startsWith(r + "/") && !k.slice(r.length + 1).includes("/")).sort();
      return {
        path: p, doc: (id) => docRef(p + "/" + id),
        onSnapshot: (next) => watch(() => {
          const ks = keys(); const list = ks.map(snapOf);
          return { key: JSON.stringify(ks.map((k) => [k, cache.get(k)])), snap: { docs: list, size: list.length, empty: !list.length, docChanges: () => [], metadata: {} } };
        }, next),
      };
    }
    // Pick up changes from your other devices: when you come back to the
    // app, when the connection returns, and every 30 seconds while it's open.
    const check = () => { if (document.visibilityState === "visible") checkForChanges().catch(() => {}); };
    document.addEventListener("visibilitychange", check);
    window.addEventListener("online", check);
    window.addEventListener("focus", check);
    setInterval(check, 30000);
    const ready = loadAll().then(() => checkForChanges());
    return { ready, api: Object.freeze({ doc: docRef, collection: colRef }) };
  }

  // ---------------------------------------------------------------------------
  // The sign-in screen
  // ---------------------------------------------------------------------------
  let session = null;
  let gateResolve, gateDone = false;
  const gate = new Promise((r) => (gateResolve = r));
  const openGate = (v) => { if (gateDone) return; gateDone = true; gateResolve(v); };
  function lockApp(locked) {
    [".wrap", "#bnav"].forEach((s) => { const n = $(s); if (n) n.inert = locked; });
    document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  }
  const TITLES = { signin: "Sign in", signup: "Create your account", reset: "Reset your password", newpass: "Choose a new password", check: "Check your email" };
  const BUTTONS = { signin: "Sign in", signup: "Create account", reset: "Send reset link" };
  function friendly(er) {
    const m = String((er && er.message) || "");
    if (/invalid login|invalid credentials/i.test(m)) return "That email and password don't match. Check them, or reset your password.";
    if (/not confirmed/i.test(m)) return "Confirm your email first: open the link we sent you, then sign in.";
    if (/already registered|already been registered|already exists/i.test(m)) return "There's already an account with this email. Sign in instead.";
    if (/rate limit|too many|security purposes/i.test(m)) return "Too many tries. Wait a minute, then try again.";
    if (/weak|pwned|leaked/i.test(m)) return "Choose a stronger password: longer, and not one used on other sites.";
    if (/not authorized|signups not allowed|signup is disabled/i.test(m)) return "New accounts can't be created on this site right now.";
    if (/fetch|network|load failed/i.test(m)) return "Can't reach the server. Check your connection and try again.";
    return m || "That didn't work. Try again.";
  }
  function authScreen(view = "signin", note = "") {
    let box = $("#auth");
    if (!box) {
      box = el("div", "auth"); box.id = "auth";
      box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "authTitle");
      document.body.append(box);
    }
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
      let nameIn = null, passIn = null;
      if (view === "signup") { const [f, i] = field("authName", "Your name (optional)", "text", "nickname", { maxLength: 60 }); nameIn = i; form.append(f); }
      const [fe, emailIn] = field("authEmail", "Email", "email", "email", { required: true, inputMode: "email", spellcheck: false });
      form.append(fe);
      if (view !== "reset") {
        const [fp, i] = field("authPass", view === "signup" ? "Password (at least 8 characters)" : "Password", "password", view === "signup" ? "new-password" : "current-password", { required: true, minLength: 8 });
        passIn = i; form.append(fp);
      }
      const go = el("button", "btn primary", BUTTONS[view]); go.type = "submit";
      form.append(go, msg);
      form.addEventListener("submit", async (e) => {
        e.preventDefault(); msg.textContent = "";
        const email = emailIn.value.trim(), pass = passIn ? passIn.value : "";
        if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = "Enter your email address."; emailIn.focus(); return; }
        if (passIn && pass.length < 8) { msg.textContent = view === "signup" ? "Use at least 8 characters for your password." : "Enter your password."; passIn.focus(); return; }
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
      if (CFG.googleSignIn && view !== "reset") {
        card.append(el("div", "auth-or", "or"));
        const g = el("button", "btn", "Continue with Google"); g.type = "button";
        g.onclick = async () => {
          const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: here() } });
          if (error) msg.textContent = "Google sign-in isn't available right now.";
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
    }
    if (view !== "newpass") {
      const guest = el("div", "auth-guest");
      const gb = el("button", "linkish", "Use Startline without an account"); gb.type = "button";
      gb.onclick = () => { ls.set(GUEST_KEY, "1"); closeAuth(); openGate(null); };
      guest.append(gb, el("span", "small muted", "Your work stays in this browser only. You can create an account later and bring it with you."));
      card.append(guest);
    }
    box.append(card);
    const first = card.querySelector("input") || h;
    setTimeout(() => first.focus(), 30);
  }
  function closeAuth() { const box = $("#auth"); if (box) box.remove(); lockApp(false); }
  async function signedIn(s) {
    session = s;
    ls.del(GUEST_KEY);
    // Already running without an account: start again, signed in.
    if (gateDone) { reload(); return; }
    closeAuth();
    const db = makeDb(s.user.id);
    try { await db.ready; } catch {}
    openGate({ db: db.api, uid: s.user.id });
  }

  async function boot() {
    if (!sb) { openGate(null); return; }
    sb.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") { session = s; authScreen("newpass"); }
      else if (event === "SIGNED_OUT" && gateDone && session) reload();
      else if (s) session = s;
    });
    const { data } = await sb.auth.getSession();
    const s = data && data.session;
    if (recovering && s) { session = s; authScreen("newpass"); return; }
    if (s) { await signedIn(s); return; }
    if (linkError) { authScreen("signin", /expired|invalid/i.test(linkError) ? "That link has expired or was already used. Sign in, or ask for a new link." : "That link didn't work: " + linkError); return; }
    if (ls.get(GUEST_KEY) === "1") { openGate(null); return; }
    authScreen("signin");
  }

  // ---------------------------------------------------------------------------
  // The capabilities the app asks for
  // ---------------------------------------------------------------------------
  const downloads = Object.freeze({
    save: async ({ filename, data }) => {
      const blob = data instanceof Blob ? data : new Blob([data], { type: /\.json$/i.test(filename) ? "application/json" : "text/plain" });
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
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvent = e; document.dispatchEvent(new Event("startline:install")); });
  window.addEventListener("appinstalled", () => { installEvent = null; document.dispatchEvent(new Event("startline:install")); });
  const standalone = () => (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
  const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  function forgetSession() {
    try { Object.keys(localStorage).filter((k) => /^sb-.*-auth-token/.test(k)).forEach((k) => localStorage.removeItem(k)); } catch {}
  }
  window.startlinePlatform = Object.freeze({
    accounts: !!sb,
    email: () => (session && session.user && session.user.email) || "",
    showAuth: (view) => authScreen(view || "signup"),
    signOut: async () => {
      reloading = true;
      try { await sb.auth.signOut(); } catch {}
      forgetSession(); location.reload();
    },
    deleteAccount: async () => {
      const { error } = await sb.rpc("delete_my_account");
      if (error) throw error;
      reloading = true;
      try { await sb.auth.signOut({ scope: "local" }); } catch {}
      forgetSession(); location.reload();
    },
    canInstall: () => !standalone() && (!!installEvent || isIOS()),
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
        setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
      }).catch(() => {});
      let had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (had) reload(); had = true; });
    });
  }
  // A sign-in or reset link pasted into a tab that already has the app open.
  window.addEventListener("hashchange", () => { if (/(^|[#&])(access_token|error_description)=/.test(location.hash)) reload(); });
  boot();
})();
