// End-to-end checks for the Startline web app, using the real supabase-js
// client against a local stand-in that runs the real schema.sql.
//   cd tests && npm install && npm run test:web        (or: node web.test.mjs accounts)
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createMiniSupabase } from "./mini-supabase.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, "..");
const AXE = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const PORT = 8080, BASE = `http://localhost:${PORT}/`;
const only = process.argv[2] || "all";

const results = [];
const check = (section, name, ok, detail = "") => { results.push({ section, name, ok: !!ok, detail: String(detail).slice(0, 400) }); console.log((ok ? "  ok   " : "  FAIL ") + section + " | " + name + (ok ? "" : " | " + String(detail).slice(0, 300))); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pageErrors = [], consoleErrors = [], cspViolations = [];

const server = spawn(process.execPath, [require.resolve("http-server/bin/http-server"), SITE, "-p", String(PORT), "-c-1", "-s"], { stdio: "ignore" });
for (let i = 0; i < 50; i++) { try { await fetch(BASE); break; } catch { await sleep(200); } }

const mini = await createMiniSupabase(join(SITE, "supabase/schema.sql"));
mini.state.siteUrl = BASE;
const CONFIG = 'window.STARTLINE_CONFIG = { supabaseUrl: "https://test.supabase.co", supabaseAnonKey: "test-publishable-key", googleSignIn: false };';

const browser = await chromium.launch();
async function open({ accounts = true, sw = "block", vp = { width: 1280, height: 900 }, scheme = "light", url = BASE, tag = "page", test = false, tz, clock } = {}) {
  const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: sw, ...(tz ? { timezoneId: tz } : {}) });
  if (test) await ctx.addInitScript(() => { window.__ddTest = true; });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  if (accounts) {
    await ctx.route(/\/config\.js$/, (r) => r.fulfill({ contentType: "application/javascript", body: CONFIG }));
    await ctx.route(/^https:\/\/test\.supabase\.co\//, (r) => mini.handle(r));
  }
  await ctx.addInitScript(() => { document.addEventListener("securitypolicyviolation", (e) => { (window.__csp = window.__csp || []).push(e.violatedDirective + " " + e.blockedURI); }); });
  const pg = await ctx.newPage();
  if (clock) await pg.clock.install({ time: new Date(clock) });
  pg.on("pageerror", (e) => pageErrors.push(tag + ": " + String(e)));
  pg.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|ERR_FAILED|ERR_NAME|net::|Failed to load resource/.test(m.text())) consoleErrors.push(tag + ": " + m.text()); });
  await pg.goto(url); await pg.waitForTimeout(300);
  return { ctx, pg };
}
async function collectCsp(pg, tag) { const v = await pg.evaluate(() => window.__csp || []).catch(() => []); v.forEach((x) => cspViolations.push(tag + ": " + x)); }
async function axe(pg, label) {
  await pg.evaluate(() => Promise.race([Promise.all(document.getAnimations().filter((a) => { const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {}; return t.iterations !== Infinity; }).map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, 2500))]));
  // The page's CSP blocks inline scripts, so axe is evaluated directly.
  await pg.evaluate(AXE);
  const r = await pg.evaluate(async () => { const res = await axe.run(document, { preload: false, runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }, resultTypes: ["violations"] }); return res.violations.map((v) => ({ id: v.id, n: v.nodes.length, sample: v.nodes.slice(0, 2).map((x) => x.target.join(" ") + " :: " + (x.failureSummary || "").split("\n").slice(1, 2).join("")) })); });
  check("Accessibility", label + ": no axe violations", r.length === 0, JSON.stringify(r));
}
const text = (pg, sel) => pg.textContent(sel).catch(() => "");
const authMsg = (pg) => text(pg, ".auth-msg");
async function signUp(pg, { name = "", email, pass }, { age = true } = {}) {
  if (!(await pg.$("#authName"))) await pg.click(".auth-seg button:has-text('Create account')");
  if (name) await pg.fill("#authName", name);
  await pg.fill("#authEmail", email); await pg.fill("#authPass", pass);
  await pg.setChecked("#authAge", age);
  await pg.click(".auth-form button[type=submit]");
}
const waitLocal = (pg) => pg.waitForFunction(() => /Saved in this browser/.test(document.querySelector("#syncText").textContent), null, { timeout: 8000 }).then(() => true, () => false);
// Accounts are offered from inside the app: Account > Create an account or sign in.
async function openAuth(pg) {
  await pg.click("#acctBtn"); await pg.waitForSelector("#createAcctBtn"); await pg.click("#createAcctBtn"); await pg.waitForSelector("#auth #authEmail");
}
async function signInFromGuest(pg, who) {
  await waitLocal(pg); await openAuth(pg); await pg.click(".auth-seg button:has-text('Sign in')");
  await Promise.all([pg.waitForNavigation({ timeout: 15000 }).catch(() => {}), signIn(pg, who)]);
  await pg.waitForTimeout(300);
}
async function signUpFromGuest(pg, who) {
  await Promise.all([pg.waitForNavigation({ timeout: 15000 }).catch(() => {}), signUp(pg, who)]);
  if (await pg.$("#auth #authName")) {
    console.log("  note: retrying sign-up once; the form said:", await pg.textContent(".auth-msg").catch(() => ""));
    await Promise.all([pg.waitForNavigation({ timeout: 15000 }).catch(() => {}), signUp(pg, who)]);
  }
  await pg.waitForTimeout(300);
}
async function answer(pg, a) {
  for (const k of ["level", "model", "channel", "country"]) { await pg.waitForSelector("#q-" + k + "-" + a[k], { timeout: 4000 }); await pg.check("#q-" + k + "-" + a[k]); await pg.waitForTimeout(280); }
  if (await pg.$("#q-ads-" + (a.ads || "none"))) { await pg.check("#q-ads-" + (a.ads || "none")); await pg.waitForTimeout(280); }
  await pg.waitForSelector("#setupForm .review"); await pg.click("#setupForm button[type=submit]"); await pg.waitForTimeout(600);
}
async function buildPlan(pg, a) { await waitLocal(pg); await pg.click("#out .btn.primary"); await pg.waitForTimeout(300); await answer(pg, a); }
async function signIn(pg, { email, pass }) {
  if (await pg.$("#authName")) await pg.click(".auth-seg button:has-text('Sign in')");
  await pg.fill("#authEmail", email); await pg.fill("#authPass", pass);
  await pg.click(".auth-form button[type=submit]");
}
const waitSynced = (pg) => pg.waitForFunction(() => /Saved to your account/.test(document.querySelector("#syncText").textContent), null, { timeout: 8000 }).then(() => true, () => false);
const tasksTab = async (pg) => { if (await pg.isVisible("#tab-tasks")) await pg.click("#tab-tasks"); else await pg.click('#bnav button[data-tab="tasks"]'); await pg.waitForTimeout(300); };
async function addTask(pg, title) {
  await tasksTab(pg); await pg.waitForSelector("#addTitle");
  await pg.fill("#addTitle", title); await pg.click("form.add button[type=submit]"); await pg.waitForTimeout(400);
}
const uidOf = async (email) => (await mini.userByEmail(email)).id;
const docsOf = async (uid) => mini.rows("select path, data from public.docs where user_id = $1 order by path", [uid]);
const outTasks = (pg) => pg.evaluate(() => document.querySelector("#out").innerText);

try {
  // ------------------------------------------------------------------ static
  if (only === "all" || only === "static") {
    const S = "Static";
    const files = []; const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); if (f === ".git" || f === "node_modules" || p === HERE) return; if (statSync(p).isDirectory()) walk(p); else files.push(p); }); walk(SITE);
    const textFiles = files.filter((f) => /\.(html|css|js|mjs|json|webmanifest|sql|md|svg)$/.test(f) && !/vendor\//.test(f));
    const personal = /andrukhov|naply|legendarycreator|7262085|ny2vc3|5627535|UCC1Krap/i;
    const hits = textFiles.filter((f) => personal.test(readFileSync(f, "utf8")));
    check(S, "no personal details of the app's owner in any file", !hits.length, hits.join(" "));
    const cfg = readFileSync(join(SITE, "config.js"), "utf8");
    check(S, "config.js ships empty (no keys committed)", /supabaseUrl:\s*""/.test(cfg) && /supabaseAnonKey:\s*""/.test(cfg));
    const secretish = textFiles.filter((f) => /sb_secret_|service_role"\s*:|eyJhbGciOi/.test(readFileSync(f, "utf8")));
    check(S, "no secret keys or tokens in any file", !secretish.length, secretish.join(" "));
    const app = readFileSync(join(SITE, "app.js"), "utf8");
    check(S, "app.js makes no direct network calls", !/\bfetch\(|XMLHttpRequest|WebSocket\(|window\.open\(/.test(app));
    check(S, "app.js has no alert/confirm/prompt", !/\b(alert|confirm)\(|window\.prompt\(/.test(app));
    const idx = readFileSync(join(SITE, "index.html"), "utf8");
    check(S, "index.html has a CSP that only allows this site, Google Fonts and Supabase", /Content-Security-Policy/.test(idx) && /script-src 'self'(;|")/.test(idx) && /connect-src 'self' https:\/\/\*\.supabase\.co/.test(idx));
    check(S, "index.html has viewport, theme colour, manifest, icons", /viewport-fit=cover/.test(idx) && /theme-color/.test(idx) && /rel="manifest"/.test(idx) && /apple-touch-icon/.test(idx));
    check(S, "no inline scripts (CSP-safe)", !/<script>(?!\s*<\/script>)/.test(idx) && !/ on[a-z]+="/.test(idx));
    check(S, ".nojekyll present for GitHub Pages", files.some((f) => f.endsWith(".nojekyll")));
    const total = files.reduce((n, f) => n + statSync(f).size, 0);
    check(S, "whole site under 2 MB", total < 2e6, total);
  }

  // ------------------------------------------------------------------ install files
  if (only === "all" || only === "pwa") {
    const S = "Installable app";
    const m = await (await fetch(BASE + "manifest.webmanifest")).json();
    check(S, "manifest has name, start_url, standalone display, colours", m.name === "Startline" && m.start_url === "./" && m.display === "standalone" && /^#/.test(m.theme_color) && /^#/.test(m.background_color));
    for (const ic of m.icons) {
      const r = await fetch(BASE + ic.src); const buf = Buffer.from(await r.arrayBuffer());
      if (ic.type === "image/png") {
        const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
        check(S, "icon " + ic.src + " is " + ic.sizes, r.ok && ic.sizes === w + "x" + h, w + "x" + h);
      } else check(S, "icon " + ic.src + " loads", r.ok);
    }
    check(S, "has a 192px and a 512px icon, and a maskable one", m.icons.some((i) => i.sizes === "192x192") && m.icons.some((i) => i.sizes === "512x512") && m.icons.some((i) => i.purpose === "maskable"));
    const at = await fetch(BASE + "icons/apple-touch-icon.png"); check(S, "apple-touch-icon loads", at.ok);
    // Service worker and offline use (no accounts configured, as shipped).
    const { ctx, pg } = await open({ accounts: false, sw: "allow", tag: "sw" });
    const reg = await pg.evaluate(async () => { const r = await navigator.serviceWorker.ready; return !!r.active; });
    check(S, "service worker installs", reg);
    await pg.reload(); await pg.waitForTimeout(500);
    check(S, "service worker controls the page after a reload", await pg.evaluate(() => !!navigator.serviceWorker.controller));
    const cached = await pg.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys.find((k) => k.startsWith("startline-app"))); return (await c.keys()).map((r) => new URL(r.url).pathname); });
    check(S, "app files are cached for offline use", ["/app.js", "/platform.js", "/styles.css", "/index.html", "/vendor/supabase.js"].every((p) => cached.includes(p)), cached.join(" "));
    await addTask(pg, "Offline check task");
    await ctx.setOffline(true);
    await pg.reload(); await pg.waitForTimeout(800);
    const offlineOk = await pg.evaluate(() => document.title === "Startline" && document.querySelector("#out").children.length > 0);
    check(S, "opens with no connection", offlineOk);
    await tasksTab(pg);
    check(S, "work saved in the browser is there offline", /Offline check task/.test(await outTasks(pg)));
    await ctx.setOffline(false);
    check(S, "no 'Install' offered before the browser allows it (desktop Chromium, no prompt yet)", !(await pg.evaluate(() => window.startlinePlatform.canInstall())));
    await collectCsp(pg, "sw"); await ctx.close();
  }

  // ------------------------------------------------------------------ no accounts configured
  if (only === "all" || only === "guest") {
    const S = "Without accounts";
    const { ctx, pg } = await open({ accounts: false, tag: "noacct" });
    check(S, "no sign-in screen when accounts aren't set up", !(await pg.$("#auth")));
    await pg.waitForFunction(() => /Saved in this browser/.test(document.querySelector("#syncText").textContent));
    check(S, "saves in this browser", true);
    await pg.click("#acctBtn"); await pg.waitForSelector("#acctDlg[open]");
    const at = await text(pg, "#acctBody");
    check(S, "account window explains where work is saved, without claude.ai wording", /saved in this browser only/.test(at) && !/claude\.ai/.test(at), at.slice(0, 200));
    check(S, "no 'Create an account' button when accounts are off", !(await pg.$("#createAcctBtn")));
    await pg.keyboard.press("Escape");
    await pg.click("#setBtn"); await pg.waitForSelector("#setDlg[open]");
    const st = await text(pg, "#setBody");
    check(S, "settings explain how to install, with no claude.ai wording", /Add to Home Screen/.test(st) && /Add to Dock/.test(st) && !/claude\.ai/.test(st));
    await pg.keyboard.press("Escape");
    await pg.click("#aiBtn"); await pg.waitForSelector("#aiDlg[open]");
    check(S, "AI settings don't offer Claude-inside-claude.ai on the web", !(await pg.$("#ai-builtin")) && !/claude\.ai account/.test(await text(pg, "#aiBody")));
    await pg.keyboard.press("Escape");
    await addTask(pg, "Local only task");
    check(S, "tasks save", /Local only task/.test(await outTasks(pg)));
    await pg.reload(); await pg.waitForTimeout(400); await tasksTab(pg);
    check(S, "tasks are still there after a reload", /Local only task/.test(await outTasks(pg)));
    await axe(pg, "app without accounts");
    await collectCsp(pg, "noacct"); await ctx.close();
  }

  // ------------------------------------------------------------------ accounts
  if (only === "all" || only === "accounts") {
    const S = "Accounts";
    const A = { name: "Sam", email: "sam@example.com", pass: "correct horse 1" };
    let { ctx, pg } = await open({ tag: "acct1" });
    await waitLocal(pg);
    check(S, "first visit opens the app straight away, with no sign-in wall", !(await pg.$("#auth")));
    await openAuth(pg);
    check(S, "'Create an account' opens the sign-up form", /Create your free account/.test(await text(pg, "#authTitle")));
    check(S, "the app behind it can't be reached", await pg.evaluate(() => document.querySelector(".wrap").inert === true));
    await pg.waitForTimeout(150);
    check(S, "cursor starts in the first box", await pg.evaluate(() => document.activeElement && document.activeElement.id === "authName"));
    for (let i = 0; i < 14; i++) await pg.keyboard.press("Tab");
    check(S, "Tab stays inside the sign-up screen", await pg.evaluate(() => !!(document.activeElement && document.activeElement.closest("#auth"))));
    await axe(pg, "create-account screen");
    await pg.keyboard.press("Escape");
    check(S, "Escape closes it and returns to the app", !(await pg.$("#auth")) && (await pg.evaluate(() => !document.querySelector(".wrap").inert)));
    await openAuth(pg); await pg.click(".auth-seg button:has-text('Sign in')");
    await axe(pg, "sign-in screen (light)");
    await pg.click(".auth-form button[type=submit]");
    check(S, "asks for an email", /Enter your email/.test(await authMsg(pg)));
    await signIn(pg, { email: "nobody@example.com", pass: "whatever123" }); await pg.waitForTimeout(400);
    check(S, "wrong email or password gets a clear message", /don't match/.test(await authMsg(pg)), await authMsg(pg));
    await pg.click(".auth-seg button:has-text('Create account')");
    await signUp(pg, { ...A, pass: "short" });
    check(S, "short password is refused before sending", /at least 8/.test(await authMsg(pg)));
    await signUp(pg, A, { age: false });
    check(S, "sign-up asks to confirm age and the terms", /16 or older/.test(await authMsg(pg)));
    const links = await pg.$$eval(".auth-age a", (as) => as.map((a) => a.getAttribute("href")));
    check(S, "sign-up links to the terms and privacy policy", links.includes("terms.html") && links.includes("privacy.html"), links.join(","));
    await signUpFromGuest(pg, A);
    check(S, "signing up opens the app, saving to the account", await waitSynced(pg));
    const uid = await uidOf(A.email);
    check(S, "the name typed at sign-up is used for your account button", (await text(pg, "#avatar")) === "S" && /^Sam:/.test(await pg.getAttribute("#acctBtn", "aria-label")), await pg.getAttribute("#acctBtn", "aria-label"));
    await addTask(pg, "Call the supplier");
    let rows = await docsOf(uid);
    const t = rows.find((r) => /^desk\/tasks\//.test(r.path));
    check(S, "a new task is stored in the database under your account", t && t.data.title === "Call the supplier", JSON.stringify(rows.map((r) => r.path)));
    check(S, "each business is its own document", rows.some((r) => r.path === "account/biz/desk"), JSON.stringify(rows.map((r) => r.path)));
    check(S, "requests carry the publishable key and your sign-in", mini.state.requests.filter((r) => r.path.startsWith("/rest/")).every((r) => r.apikey === "test-publishable-key" && r.auth === "bearer"));
    const st0 = await pg.evaluate(() => Object.keys(localStorage).filter((k) => /^dd-local-tasks/.test(k)).length);
    check(S, "signed-in work isn't written to browser storage", st0 === 0);
    await pg.click("#acctBtn"); await pg.waitForSelector("#acctDlg[open]");
    check(S, "account window shows who's signed in", /Signed in as sam@example\.com/.test(await text(pg, "#acctBody")));
    await axe(pg, "account window (signed in)");
    await pg.keyboard.press("Escape");
    await pg.reload(); await pg.waitForTimeout(300);
    check(S, "stays signed in after a reload", !(await pg.$("#auth")) && (await waitSynced(pg)));
    await tasksTab(pg);
    check(S, "your tasks load from the account after a reload", /Call the supplier/.test(await outTasks(pg)));

    // A second device
    const d2 = await open({ tag: "acct2", vp: { width: 390, height: 844 } });
    await signInFromGuest(d2.pg, A);
    check(S, "signing in on another device works", await waitSynced(d2.pg));
    await tasksTab(d2.pg);
    check(S, "the other device sees the same tasks", /Call the supplier/.test(await outTasks(d2.pg)));
    await addTask(d2.pg, "Order samples");
    await pg.evaluate(() => window.dispatchEvent(new Event("focus"))); await pg.waitForTimeout(900);
    check(S, "a change on one device shows up on the other when you come back to it", /Order samples/.test(await outTasks(pg)));
    await d2.ctx.close();

    // Sign out
    await pg.click("#acctBtn"); await pg.waitForSelector("#signOutBtn");
    await Promise.all([pg.waitForNavigation(), pg.click("#signOutBtn")]); await pg.waitForTimeout(300);
    check(S, "signing out returns to the app without an account", !(await pg.$("#auth")) && (await waitLocal(pg)));
    check(S, "signing out forgets the session and the device copy", await pg.evaluate(async () => !Object.keys(localStorage).some((k) => /auth-token/.test(k)) && (await new Promise((res) => { const r = indexedDB.open("startline"); r.onsuccess = () => { const t = r.result.transaction("docs").objectStore("docs").count(); t.onsuccess = () => res(t.result === 0); }; r.onerror = () => res(true); }))));
    await signInFromGuest(pg, A);
    check(S, "signing back in works", await waitSynced(pg));
    await collectCsp(pg, "acct1"); await ctx.close();

    // From no account to an account: bring the browser's work along
    ({ ctx, pg } = await open({ tag: "move" }));
    await waitLocal(pg);
    await addTask(pg, "Guest task one"); await addTask(pg, "Guest task two");
    await pg.click("#acctBtn"); await pg.waitForSelector("#createAcctBtn");
    check(S, "account window offers to create an account", /without an account/.test(await text(pg, "#acctBody")));
    await axe(pg, "account window (no account)");
    await pg.keyboard.press("Escape");
    await signInFromGuest(pg, A);
    check(S, "signing in from the app switches to the account", await waitSynced(pg));
    await pg.waitForSelector("#moveDlg[open]", { timeout: 5000 }).catch(() => {});
    const offer = await text(pg, "#moveDlg");
    check(S, "offers to bring this browser's work into the account", /1 business, 2 tasks/.test(offer), offer.slice(0, 200));
    await axe(pg, "bring-your-work window");
    await pg.click("#moveGo"); await pg.waitForTimeout(1500);
    check(S, "copying confirms what it did", /Copied 1 business/.test(await text(pg, "#toast")), await text(pg, "#toast"));
    rows = await docsOf(uid);
    const bizDocs = rows.filter((r) => r.path.startsWith("account/biz/"));
    const nb = bizDocs.find((r) => r.path !== "account/biz/desk");
    const nbId = nb && nb.path.split("/").pop();
    check(S, "the browser's business is added next to the account's own", bizDocs.length === 2 && !!nb, JSON.stringify(bizDocs.map((r) => r.path)));
    check(S, "its tasks are in the account", nbId && rows.filter((r) => r.path.startsWith(nbId + "/tasks/")).map((r) => r.data.title).sort().join("|") === "Guest task one|Guest task two");
    check(S, "the account's own business is untouched", rows.some((r) => r.path.startsWith("desk/tasks/") && r.data.title === "Call the supplier"));
    check(S, "the copy in this browser is kept", await pg.evaluate(() => (JSON.parse(localStorage.getItem("dd-local-tasks") || "[]")).length === 2));
    await pg.click("#acctBtn"); await pg.waitForSelector("#acctDlg[open]");
    check(S, "the copy button goes away once copied", !(await pg.$("text=Copy this browser's work into your account")));
    await pg.keyboard.press("Escape");
    await pg.reload(); await pg.waitForTimeout(1600);
    check(S, "doesn't ask again after copying", !(await pg.$("#moveDlg")));
    await collectCsp(pg, "move"); await ctx.close();

    // Confirm-your-email sign-ups
    mini.state.confirmEmail = true;
    const B = { email: "lee@example.com", pass: "another pass 2" };
    ({ ctx, pg } = await open({ tag: "confirm" }));
    await waitLocal(pg); await openAuth(pg);
    await signUp(pg, B);
    await pg.waitForFunction(() => /Check your email/.test((document.querySelector("#authTitle") || {}).textContent || ""), null, { timeout: 6000 }).catch(() => {});
    check(S, "with email confirmation on, sign-up says to check your email", /Check your email/.test(await text(pg, "#authTitle")) && /We sent a link to lee@example\.com/.test(await text(pg, ".auth-note")), await text(pg, ".auth-note"));
    await pg.click(".auth-card > .btn:has-text('Back to sign in')");
    await signUp(pg, B);
    await pg.waitForFunction(() => /Check your email/.test((document.querySelector("#authTitle") || {}).textContent || ""), null, { timeout: 6000 }).catch(() => {});
    check(S, "signing up again with the same email doesn't claim a new account", /If lee@example\.com doesn't have an account yet/.test(await text(pg, ".auth-note")), await text(pg, ".auth-note"));
    await pg.click(".auth-card > .btn:has-text('Back to sign in')");
    await signIn(pg, B); await pg.waitForTimeout(400);
    check(S, "signing in before confirming explains why it can't", /Confirm your email first/.test(await authMsg(pg)), await authMsg(pg));
    const mail = mini.state.outbox.filter((m) => m.type === "signup" && m.to === B.email).pop();
    check(S, "the confirmation link returns to the app", mail && mail.link.startsWith(BASE + "#"));
    await mini.db.query("update auth.users set confirmed = true where email = $1", [B.email]);
    const tab = await ctx.newPage(); await tab.goto(mail.link); await tab.waitForTimeout(500);
    check(S, "opening the confirmation link (in a new tab, as email apps do) signs you in", await waitSynced(tab));
    check(S, "the link's tokens are cleared from the address bar", !/access_token/.test(tab.url()), tab.url());
    await addTask(tab, "Lee's first task");
    await collectCsp(pg, "confirm"); await ctx.close();
    mini.state.confirmEmail = false;

    // Forgot password
    ({ ctx, pg } = await open({ tag: "reset" }));
    await waitLocal(pg); await openAuth(pg); await pg.click(".auth-seg button:has-text('Sign in')");
    await pg.click("text=Forgot your password?");
    check(S, "'Forgot your password?' opens the reset form", /Reset your password/.test(await text(pg, "#authTitle")));
    await pg.fill("#authEmail", A.email); await pg.click(".auth-form button[type=submit]"); await pg.waitForTimeout(400);
    check(S, "reset says to check your email", /Check your email/.test(await text(pg, "#authTitle")));
    const rm = mini.state.outbox.filter((m) => m.type === "recovery" && m.to === A.email).pop();
    check(S, "a reset link was sent to the account's email", !!rm);
    await pg.goto(rm.link); await pg.waitForSelector("#authNewPass", { timeout: 5000 }).catch(() => {});
    check(S, "the reset link asks for a new password, even pasted into a tab that has the app open", /Choose a new password/.test(await text(pg, "#authTitle")));
    await axe(pg, "new-password screen");
    await pg.fill("#authNewPass", "brand new pass 3"); await pg.click(".auth-form button[type=submit]");
    check(S, "saving the new password opens the app", await waitSynced(pg));
    await pg.waitForTimeout(800);
    check(S, "confirms the password changed", /password was changed/.test(await text(pg, "#toast")), await text(pg, "#toast"));
    await pg.click("#acctBtn"); await pg.waitForSelector("#signOutBtn");
    await Promise.all([pg.waitForNavigation(), pg.click("#signOutBtn")]); await pg.waitForTimeout(300);
    await openAuth(pg); await signIn(pg, A); await pg.waitForTimeout(500);
    check(S, "the old password no longer works", /don't match/.test(await authMsg(pg)));
    A.pass = "brand new pass 3";
    await Promise.all([pg.waitForNavigation(), signIn(pg, A)]);
    check(S, "the new password works", await waitSynced(pg));
    await collectCsp(pg, "reset"); await ctx.close();

    // An expired link
    ({ ctx, pg } = await open({ tag: "expired", url: BASE + "#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired" }));
    await pg.waitForSelector("#auth");
    check(S, "an expired email link is explained", /expired/.test(await text(pg, ".auth-note")), await text(pg, ".auth-note"));
    check(S, "the error is cleared from the address bar", !/error/.test(pg.url()));
    await ctx.close();

    // Install
    ({ ctx, pg } = await open({ tag: "install" }));
    await signInFromGuest(pg, A); await waitSynced(pg);
    await pg.evaluate(() => { const e = new Event("beforeinstallprompt", { cancelable: true }); e.prompt = () => { window.__prompted = true; }; e.userChoice = Promise.resolve({ outcome: "accepted", platform: "web" }); window.dispatchEvent(e); });
    await pg.click("#setBtn"); await pg.waitForSelector("#set-install button");
    await pg.click("#set-install button"); await pg.waitForTimeout(400);
    check(S, "the Install button opens the browser's install prompt", await pg.evaluate(() => window.__prompted === true));
    check(S, "installing confirms", /Installed/.test(await text(pg, "#toast")));
    await pg.keyboard.press("Escape");
    check(S, "after installing, Install isn't offered again", !(await pg.evaluate(() => window.startlinePlatform.canInstall())));

    // Delete the account
    await pg.click("#acctBtn"); await pg.waitForSelector("#delAcctBtn");
    await pg.click("#delAcctBtn");
    check(S, "deleting the account asks you to confirm first", /Yes, delete my account/.test(await text(pg, "#delAcctBtn")));
    await Promise.all([pg.waitForNavigation(), pg.click("#delAcctBtn")]); await pg.waitForTimeout(400);
    check(S, "after deleting, you're back in the app without an account", !(await pg.$("#auth")) && (await waitLocal(pg)));
    check(S, "the account and all its data are gone from the database", !(await mini.userByEmail(A.email)) && (await docsOf(uid)).length === 0);
    const other = await uidOf(B.email);
    check(S, "other accounts are untouched", (await docsOf(other)).length > 0);
    await openAuth(pg); await signIn(pg, A); await pg.waitForTimeout(400);
    check(S, "a deleted account can't sign in", /don't match/.test(await authMsg(pg)));
    await collectCsp(pg, "install"); await ctx.close();

    // Phone size and dark mode
    ({ ctx, pg } = await open({ tag: "mobile", vp: { width: 360, height: 740 }, scheme: "dark" }));
    await waitLocal(pg); await openAuth(pg);
    const fits = await pg.evaluate(() => { const c = document.querySelector(".auth-card").getBoundingClientRect(); return c.left >= 0 && c.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth; });
    check(S, "sign-up screen fits a 360px phone", fits);
    await axe(pg, "sign-up screen (phone, dark)");
    await ctx.close();
  }

  // ------------------------------------------------------------------ saving
  if (only === "all" || only === "saving") {
    const S = "Saving";
    const C = { email: "casey@example.com", pass: "casey pass 123" };
    let { ctx, pg } = await open({ tag: "save1" });
    await waitLocal(pg); await openAuth(pg);
    await signUpFromGuest(pg, C);
    await waitSynced(pg);
    const uid = await uidOf(C.email);
    await addTask(pg, "Task before outage");
    await pg.click("#acctBtn"); await pg.fill("#newBizName", "Candle shop"); await pg.click("#acct-biz button:has-text('Add business')"); await pg.waitForTimeout(600);
    await addTask(pg, "Candle task");

    // A failed first load never opens an empty account
    const d2 = await open({ tag: "save2" });
    const before = (await docsOf(uid)).length;
    mini.state.restDown = true;
    await signInFromGuest(d2.pg, C);
    await d2.pg.waitForSelector("#auth", { timeout: 8000 }).catch(() => {});
    check(S, "when the account can't be loaded, it says so instead of opening an empty account", /Can't reach your account/.test(await text(d2.pg, "#authTitle")), await text(d2.pg, "#authTitle"));
    mini.state.restDown = false;
    check(S, "nothing in the account was changed", (await docsOf(uid)).length === before);
    await d2.pg.click(".auth-actions button:has-text('Try again')");
    check(S, "'Try again' opens the account once it's reachable", await waitSynced(d2.pg));
    await d2.pg.click("#acctBtn"); await d2.pg.waitForSelector("#acctDlg[open]");
    check(S, "both businesses are there", /Candle shop/.test(await text(d2.pg, "#acctBody")) && /My business/.test(await text(d2.pg, "#acctBody")));
    await d2.pg.keyboard.press("Escape");

    // Changes made without a connection wait on the device
    mini.state.restDown = true;
    await addTask(pg, "Offline task");
    check(S, "a change made offline stays on screen", /Offline task/.test(await outTasks(pg)));
    await pg.waitForFunction(() => /Offline/.test(document.querySelector("#syncText").textContent), null, { timeout: 8000 }).catch(() => {});
    check(S, "the header says it will sync", /Offline · will sync/.test(await text(pg, "#syncText")), await text(pg, "#syncText"));
    check(S, "it hasn't reached the server yet", !(await docsOf(uid)).some((r) => r.data && r.data.title === "Offline task"));
    const r0 = Date.now(); await pg.reload();
    await pg.waitForFunction(() => document.querySelector("#out") && !document.querySelector("#out").inert && /Offline|Saving|Saved/.test(document.querySelector("#syncText").textContent), null, { timeout: 15000 }).catch(() => {});
    check(S, "reopening the app offline is quick", Date.now() - r0 < 4000, Date.now() - r0 + " ms");
    await tasksTab(pg);
    check(S, "reopening the app offline shows your work from the device", /Offline task/.test(await outTasks(pg)) && /Candle task/.test(await outTasks(pg)));
    mini.state.restDown = false;
    await pg.evaluate(() => window.dispatchEvent(new Event("online")));
    check(S, "back online, the change is sent", await waitSynced(pg));
    check(S, "and reaches the server", (await docsOf(uid)).some((r) => r.data && r.data.title === "Offline task"));

    // Two devices change the account at once
    await d2.pg.click("#acctBtn"); await d2.pg.fill("#newBizName", "Etsy shop"); await d2.pg.click("#acct-biz button:has-text('Add business')"); await d2.pg.waitForTimeout(600);
    await pg.click("#acctBtn"); await pg.fill("#acctName", "Casey"); await pg.click("#acct-name button[type=submit]"); await pg.waitForTimeout(600);
    await pg.keyboard.press("Escape");
    const rows = await docsOf(uid);
    check(S, "a business added on one device and a name saved on another both stick", rows.filter((r) => r.path.startsWith("account/biz/")).length === 3 && (rows.find((r) => r.path === "account") || {}).data?.name === "Casey", JSON.stringify(rows.filter((r) => r.path.startsWith("account")).map((r) => r.path + "=" + JSON.stringify(r.data).slice(0, 60))));
    await pg.evaluate(() => window.dispatchEvent(new Event("focus"))); await pg.waitForTimeout(900);
    await pg.click("#acctBtn");
    check(S, "the other device's new business appears", /Etsy shop/.test(await text(pg, "#acctBody")));
    await pg.keyboard.press("Escape");
    await d2.ctx.close();

    // Signing out with changes not yet sent asks first
    mini.state.restDown = true;
    await addTask(pg, "Unsent task");
    await pg.click("#acctBtn"); await pg.waitForSelector("#signOutBtn"); await pg.click("#signOutBtn"); await pg.waitForTimeout(300);
    check(S, "signing out with unsent changes asks first", /Sign out anyway/.test(await text(pg, "#signOutBtn")) && !!(await pg.$("#signOutBtn")));
    mini.state.restDown = false;
    await pg.keyboard.press("Escape");
    await pg.evaluate(() => window.dispatchEvent(new Event("online"))); await waitSynced(pg);
    await collectCsp(pg, "save1"); await ctx.close();

    // Older accounts (one document) are split up on first sign-in
    ({ ctx, pg } = await open({ tag: "migrate" }));
    const D = { email: "dee@example.com", pass: "dee pass 1234" };
    await waitLocal(pg); await openAuth(pg);
    await signUpFromGuest(pg, D); await waitSynced(pg);
    const did = await uidOf(D.email);
    await mini.db.query("delete from public.docs where user_id = $1", [did]);
    await mini.db.query("insert into public.docs (user_id, path, data) values ($1, 'account', $2::jsonb)", [did, JSON.stringify({ name: "Dee", current: "b_abcd1234", businesses: [{ id: "desk", name: "Main shop", createdAt: "2026-01-02" }, { id: "b_abcd1234", name: "Second shop", createdAt: "2026-02-03" }], badges: ["first-step"] })]);
    await ctx.close();
    ({ ctx, pg } = await open({ tag: "migrate2" }));
    await signInFromGuest(pg, D); await waitSynced(pg); await pg.waitForTimeout(800);
    const drows = await docsOf(did);
    check(S, "an older account's businesses become separate documents", ["account/biz/desk", "account/biz/b_abcd1234", "account/badges/first-step"].every((p) => drows.some((r) => r.path === p)), JSON.stringify(drows.map((r) => r.path)));
    check(S, "the account record is upgraded and keeps the name", (drows.find((r) => r.path === "account") || {}).data?.v === 2 && (drows.find((r) => r.path === "account") || {}).data?.name === "Dee");
    check(S, "the business that was open stays open", /Second shop/.test(await text(pg, "#bizName")), await text(pg, "#bizName"));
    await ctx.close();

    // Two tabs without an account
    ({ ctx, pg } = await open({ accounts: false, tag: "tabs" }));
    const pg2 = await ctx.newPage(); await pg2.goto(BASE); await pg2.waitForTimeout(400);
    await addTask(pg, "Tab A task"); await addTask(pg2, "Tab B task");
    const both = await pg.evaluate(() => JSON.parse(localStorage.getItem("dd-local-tasks") || "[]").map((t) => t.title));
    check(S, "two open tabs don't overwrite each other's tasks", both.includes("Tab A task") && both.includes("Tab B task"), both.join("|"));
    await pg.waitForTimeout(400); await tasksTab(pg);
    check(S, "each tab shows the other's changes", /Tab B task/.test(await outTasks(pg)));

    // Browser storage is full
    // Fill this site's storage right up to the limit.
    await pg.evaluate(() => { let n = 0; for (const size of [1 << 20, 1 << 16, 1 << 12, 1 << 8, 16, 1]) { const chunk = "x".repeat(size); for (;;) { try { localStorage.setItem("filler" + n++, chunk); } catch { break; } } } });
    await addTask(pg, "This won't fit");
    check(S, "a full browser says the change wasn't saved", /storage is full/.test(await text(pg, "#toast")) && /Not saved/.test(await text(pg, "#syncText")), (await text(pg, "#toast")) + " / " + (await text(pg, "#syncText")));
    check(S, "and doesn't pretend it was", !/This won't fit/.test(await outTasks(pg)));
    await pg.evaluate(() => { Object.keys(localStorage).filter((k) => k.startsWith("filler")).forEach((k) => localStorage.removeItem(k)); });
    await ctx.close();

    // Plan, date and calculator fixes
    ({ ctx, pg } = await open({ accounts: false, tag: "plan", test: true }));
    await buildPlan(pg, { level: "new", model: "supplier", channel: "shopify", country: "us" });
    await pg.click("#tab-plan"); await pg.click("text=Change answers"); await pg.waitForSelector("#setupForm .review");
    await pg.click("#setupForm .review button[aria-label^='Change: How do you want']"); await pg.check("#q-model-affiliate"); await pg.waitForTimeout(350);
    if (await pg.isVisible("#q-channel-aff_amazon").catch(() => false)) { await pg.check("#q-channel-aff_amazon"); await pg.waitForTimeout(350); }
    await pg.waitForSelector("#setupForm .review"); await pg.click("#setupForm button[type=submit]"); await pg.waitForTimeout(800);
    const counts = await pg.evaluate(() => { const p = JSON.parse(localStorage.getItem("dd-local-profile")); const plan = JSON.parse(localStorage.getItem("dd-local-tasks")).filter((t) => t.source === "plan"); return [plan.length, window.__dd.applicable(p).length, plan.filter((t) => !window.__dd.applicable(p).some((s) => s.id === t.step)).map((t) => t.step)]; });
    check(S, "changing plan answers leaves no old steps behind", counts[0] === counts[1] && !counts[2].length, JSON.stringify(counts));
    check(S, "monthly repeats keep their day, or use the month's last day", await pg.evaluate(() => window.__dd.addMonth("2026-01-31") === "2026-02-28" && window.__dd.addMonth("2026-02-28", 31) === "2026-03-31" && window.__dd.addMonth("2026-12-15") === "2027-01-15"));
    await pg.click("#tab-tools"); await pg.selectOption("#toolSelect", "royalty").catch(async () => { await pg.click(".hub-nav button:has-text('Book royalties')"); });
    await pg.waitForSelector("#n-bkPrint"); await pg.fill("#n-bkPaper", "12"); await pg.fill("#n-bkPrint", "4"); await pg.waitForTimeout(200);
    check(S, "the book calculator's lowest price follows KDP's 50%/60% rule", /Lowest list price KDP allows\s*\$8\.00/.test(await outTasks(pg)), (await outTasks(pg)).match(/Lowest[^\n]*\n?[^\n]*/)?.[0]);
    await pg.selectOption("#toolSelect", "delivery").catch(async () => { await pg.click(".hub-nav button:has-text('Delivery dates')"); });
    await pg.waitForSelector("#n-handling");
    const t0 = Date.now(); await pg.fill("#n-handling", "100000"); await pg.waitForTimeout(100); await pg.evaluate(() => 1);
    check(S, "a huge number in the delivery tool doesn't freeze the app", Date.now() - t0 < 2500, Date.now() - t0 + " ms");
    await pg.reload(); const t1 = Date.now(); await pg.waitForFunction(() => document.querySelector("#out").children.length > 0, null, { timeout: 5000 }).catch(() => {});
    check(S, "and the app still opens quickly afterwards", Date.now() - t1 < 4000, Date.now() - t1 + " ms");
    await tasksTab(pg);
    const chk = await pg.$("#out button.check"); await chk.focus(); await pg.keyboard.press("Space"); await pg.waitForTimeout(500);
    check(S, "ticking a task with the keyboard keeps your place", await pg.evaluate(() => !!(document.activeElement && document.activeElement.dataset && /^chk:/.test(document.activeElement.dataset.fk || ""))), await pg.evaluate(() => document.activeElement && document.activeElement.outerHTML.slice(0, 80)));
    await ctx.close();

    // Day N of the plan after the spring clock change (New York, 8 March 2026)
    ({ ctx, pg } = await open({ accounts: false, tag: "dst", tz: "America/New_York", clock: "2026-03-06T12:00:00-05:00" }));
    await buildPlan(pg, { level: "new", model: "digital", channel: "etsy", country: "us" });
    await pg.clock.setSystemTime(new Date("2026-03-09T12:00:00-04:00")); await pg.reload(); await pg.waitForTimeout(500);
    check(S, "the plan's day count is right after the clocks change", /Day 4 of 7/i.test(await outTasks(pg)), (await outTasks(pg)).slice(0, 120));
    await ctx.close();
  }
} catch (e) {
  check("Runtime", "test run finished", false, e.stack || e);
}
check("Runtime", "no uncaught page errors", !pageErrors.length, pageErrors.join("\n"));
check("Runtime", "no console errors", !consoleErrors.length, consoleErrors.join("\n"));
check("Runtime", "no Content-Security-Policy violations", !cspViolations.length, cspViolations.join("\n"));
await browser.close(); server.kill();
const by = {}; results.forEach((r) => { by[r.section] = by[r.section] || [0, 0]; by[r.section][r.ok ? 0 : 1]++; });
console.log("\n" + Object.entries(by).map(([k, [p, f]]) => `${k}: ${p}/${p + f}`).join("\n"));
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
writeFileSync(join(HERE, "results.json"), JSON.stringify(results, null, 1));
process.exit(failed ? 1 : 0);
