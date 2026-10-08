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
async function open({ accounts = true, sw = "block", vp = { width: 1280, height: 900 }, scheme = "light", url = BASE, tag = "page" } = {}) {
  const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme, serviceWorkers: sw });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  if (accounts) {
    await ctx.route(/\/config\.js$/, (r) => r.fulfill({ contentType: "application/javascript", body: CONFIG }));
    await ctx.route(/^https:\/\/test\.supabase\.co\//, (r) => mini.handle(r));
  }
  await ctx.addInitScript(() => { document.addEventListener("securitypolicyviolation", (e) => { (window.__csp = window.__csp || []).push(e.violatedDirective + " " + e.blockedURI); }); });
  const pg = await ctx.newPage();
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
async function signUp(pg, { name = "", email, pass }) {
  if (!(await pg.$("#authName"))) await pg.click(".auth-seg button:has-text('Create account')");
  if (name) await pg.fill("#authName", name);
  await pg.fill("#authEmail", email); await pg.fill("#authPass", pass);
  await pg.click(".auth-form button[type=submit]");
}
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
    await pg.waitForSelector("#auth");
    check(S, "first visit shows the sign-in screen", /Sign in/.test(await text(pg, "#authTitle")));
    check(S, "the app behind it can't be reached", await pg.evaluate(() => document.querySelector(".wrap").inert === true));
    check(S, "cursor starts in the email box", await pg.evaluate(() => document.activeElement && document.activeElement.id === "authEmail"));
    for (let i = 0; i < 12; i++) await pg.keyboard.press("Tab");
    check(S, "Tab stays inside the sign-in screen", await pg.evaluate(() => !!(document.activeElement && document.activeElement.closest("#auth"))));
    await axe(pg, "sign-in screen (light)");
    await pg.click(".auth-form button[type=submit]");
    check(S, "asks for an email", /Enter your email/.test(await authMsg(pg)));
    await signIn(pg, { email: "nobody@example.com", pass: "whatever123" }); await pg.waitForTimeout(400);
    check(S, "wrong email or password gets a clear message", /don't match/.test(await authMsg(pg)), await authMsg(pg));
    await pg.click(".auth-seg button:has-text('Create account')");
    await axe(pg, "create-account screen");
    await signUp(pg, { name: A.name, email: A.email, pass: "short" });
    check(S, "short password is refused before sending", /at least 8/.test(await authMsg(pg)));
    await signUp(pg, A);
    check(S, "signing up opens the app, saving to the account", await waitSynced(pg));
    check(S, "sign-in screen is gone and the app is usable", !(await pg.$("#auth")) && (await pg.evaluate(() => !document.querySelector(".wrap").inert)));
    const uid = await uidOf(A.email);
    check(S, "the name typed at sign-up is used for your account button", (await text(pg, "#avatar")) === "S" && /^Sam:/.test(await pg.getAttribute("#acctBtn", "aria-label")), await pg.getAttribute("#acctBtn", "aria-label"));
    await addTask(pg, "Call the supplier");
    let rows = await docsOf(uid);
    const t = rows.find((r) => /^desk\/tasks\//.test(r.path));
    check(S, "a new task is stored in the database under your account", t && t.data.title === "Call the supplier", JSON.stringify(rows.map((r) => r.path)));
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
    await d2.pg.waitForSelector("#auth");
    await signIn(d2.pg, A);
    check(S, "signing in on another device works", await waitSynced(d2.pg));
    await tasksTab(d2.pg);
    check(S, "the other device sees the same tasks", /Call the supplier/.test(await outTasks(d2.pg)));
    await addTask(d2.pg, "Order samples");
    await pg.evaluate(() => window.dispatchEvent(new Event("focus"))); await pg.waitForTimeout(800);
    check(S, "a change on one device shows up on the other when you come back to it", /Order samples/.test(await outTasks(pg)));
    await d2.ctx.close();

    // A save that fails is undone on screen
    mini.state.failNext = { status: 503, code: "PGRST000", message: "Service unavailable" };
    await addTask(pg, "This one fails");
    await pg.waitForTimeout(400);
    check(S, "a failed save says so", /didn't save/.test(await text(pg, "#toast")), await text(pg, "#toast"));
    check(S, "a failed save is undone on screen", !/This one fails/.test(await outTasks(pg)));

    // Sign out
    await pg.click("#acctBtn"); await pg.waitForSelector("#signOutBtn");
    await Promise.all([pg.waitForNavigation(), pg.click("#signOutBtn")]); await pg.waitForTimeout(300);
    check(S, "signing out returns to the sign-in screen", !!(await pg.$("#auth")));
    check(S, "signing out forgets the session in this browser", await pg.evaluate(() => !Object.keys(localStorage).some((k) => /auth-token/.test(k))));
    await signIn(pg, { email: A.email, pass: A.pass });
    check(S, "signing back in works", await waitSynced(pg));
    await collectCsp(pg, "acct1"); await ctx.close();

    // From no account to an account: bring the browser's work along
    ({ ctx, pg } = await open({ tag: "move" }));
    await pg.waitForSelector("#auth");
    await pg.click(".auth-guest .linkish");
    await pg.waitForFunction(() => /Saved in this browser/.test(document.querySelector("#syncText").textContent));
    check(S, "'Use without an account' opens the app in this browser", !(await pg.$("#auth")));
    await addTask(pg, "Guest task one"); await addTask(pg, "Guest task two");
    await pg.click("#acctBtn"); await pg.waitForSelector("#createAcctBtn");
    check(S, "account window offers to create an account", /without an account/.test(await text(pg, "#acctBody")));
    await axe(pg, "account window (no account)");
    await pg.click("#createAcctBtn"); await pg.waitForSelector("#auth #authName");
    await pg.reload(); await pg.waitForTimeout(300);
    check(S, "choosing guest mode is remembered", !(await pg.$("#auth")));
    await pg.click("#acctBtn"); await pg.click("#createAcctBtn"); await pg.waitForSelector("#auth");
    await Promise.all([pg.waitForNavigation(), signIn(pg, A)]);
    check(S, "signing in from guest mode switches to the account", await waitSynced(pg));
    await pg.waitForSelector("#moveDlg[open]", { timeout: 5000 }).catch(() => {});
    const offer = await text(pg, "#moveDlg");
    check(S, "offers to bring this browser's work into the account", /1 business, 2 tasks/.test(offer), offer.slice(0, 200));
    await axe(pg, "bring-your-work window");
    await pg.click("#moveGo"); await pg.waitForTimeout(1500);
    check(S, "copying confirms what it did", /Copied 1 business/.test(await text(pg, "#toast")), await text(pg, "#toast"));
    rows = await docsOf(uid);
    const acct = rows.find((r) => r.path === "account").data;
    const nb = acct.businesses.find((b) => b.id !== "desk");
    check(S, "the browser's business is added next to the account's own", acct.businesses.length === 2 && !!nb, JSON.stringify(acct.businesses));
    check(S, "its tasks are in the account", nb && rows.filter((r) => r.path.startsWith(nb.id + "/tasks/")).map((r) => r.data.title).sort().join("|") === "Guest task one|Guest task two");
    check(S, "the account's own business is untouched", rows.some((r) => r.path.startsWith("desk/tasks/") && r.data.title === "Call the supplier"));
    check(S, "the copy in this browser is kept", await pg.evaluate(() => (JSON.parse(localStorage.getItem("dd-local-tasks") || "[]")).length === 2));
    await pg.reload(); await pg.waitForTimeout(1600);
    check(S, "doesn't ask again after copying", !(await pg.$("#moveDlg")));
    await collectCsp(pg, "move"); await ctx.close();

    // Confirm-your-email sign-ups
    mini.state.confirmEmail = true;
    const B = { email: "lee@example.com", pass: "another pass 2" };
    ({ ctx, pg } = await open({ tag: "confirm" }));
    await pg.waitForSelector("#auth");
    await signUp(pg, B); await pg.waitForTimeout(400);
    check(S, "with email confirmation on, sign-up says to check your email", /Check your email/.test(await text(pg, "#authTitle")) && /lee@example\.com/.test(await text(pg, ".auth-note")));
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
    await pg.waitForSelector("#auth");
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
    await signIn(pg, A); await pg.waitForTimeout(500);
    check(S, "the old password no longer works", /don't match/.test(await authMsg(pg)));
    A.pass = "brand new pass 3";
    await signIn(pg, A);
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
    await pg.waitForSelector("#auth"); await signIn(pg, A); await waitSynced(pg);
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
    check(S, "after deleting, you're back at the sign-in screen", !!(await pg.$("#auth")));
    check(S, "the account and all its data are gone from the database", !(await mini.userByEmail(A.email)) && (await docsOf(uid)).length === 0);
    const other = await uidOf(B.email);
    check(S, "other accounts are untouched", (await docsOf(other)).length > 0);
    await signIn(pg, A); await pg.waitForTimeout(400);
    check(S, "a deleted account can't sign in", /don't match/.test(await authMsg(pg)));
    await collectCsp(pg, "install"); await ctx.close();

    // Phone size and dark mode
    ({ ctx, pg } = await open({ tag: "mobile", vp: { width: 360, height: 740 }, scheme: "dark" }));
    await pg.waitForSelector("#auth");
    const fits = await pg.evaluate(() => { const c = document.querySelector(".auth-card").getBoundingClientRect(); return c.left >= 0 && c.right <= innerWidth && document.documentElement.scrollWidth <= innerWidth; });
    check(S, "sign-in screen fits a 360px phone", fits);
    await axe(pg, "sign-in screen (phone, dark)");
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
