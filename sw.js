/*
 * Startline service worker: lets the app open and run offline.
 *
 * The page is fetched from the network first, so you get the latest release
 * when you're online and the saved copy when you're not. The app's files are
 * loaded with a version stamp (tools/stamp.mjs), so each release is kept as
 * one matching set; when a new release is found, the app offers to reload.
 * Your account's requests (Supabase) are never cached here.
 */
const VERSION = "00fe25c83e";
const CACHE = "startline-" + VERSION;
const SHELL = [
  "./",
  "index.html",
  "config.js",
  "styles.css?v=3556f88dd5",
  "fonts/fonts.css?v=7df2df87e5",
  "platform.js?v=6f33b60584",
  "app.js?v=438539fe11",
  "manifest.webmanifest",
  "privacy.html",
  "terms.html",
  "icons/favicon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
  "fonts/unbounded-latin-500-normal.woff2",
  "fonts/unbounded-latin-600-normal.woff2",
  "fonts/unbounded-latin-700-normal.woff2",
  "fonts/instrument-sans-latin-400-normal.woff2",
  "fonts/instrument-sans-latin-500-normal.woff2",
  "fonts/instrument-sans-latin-600-normal.woff2",
  "fonts/instrument-sans-latin-700-normal.woff2",
  "fonts/dm-mono-latin-400-normal.woff2",
  "fonts/dm-mono-latin-500-normal.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("startline-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

// Fresh from the network (checked with the server, not the browser's HTTP
// cache), with a time limit; a late answer still updates the saved copy.
function networkFirst(event, cacheKey) {
  const request = event.request;
  const fresh = fetch(request, { cache: "no-cache" }).then(async (response) => {
    if (response && response.ok && response.type === "basic") { const c = await caches.open(CACHE); await c.put(cacheKey || request, response.clone()); }
    return response;
  });
  event.waitUntil(fresh.catch(() => {}));
  const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
  return Promise.race([fresh.catch(() => null), timeout]).then(async (response) => {
    if (response) return response;
    const hit = await caches.match(cacheKey || request, { ignoreSearch: !cacheKey });
    return hit || fresh;
  });
}

// Stamped files never change, so the saved copy is used whenever there is one.
async function cacheFirst(request) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response && response.ok && response.type === "basic") { const c = await caches.open(CACHE); c.put(request, response.clone()); }
  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // your account and the sites you open go straight to the network
  if (request.mode === "navigate") { event.respondWith(networkFirst(event, "./")); return; }
  if (url.searchParams.has("v") || /\/(fonts|icons|vendor)\//.test(url.pathname)) { event.respondWith(cacheFirst(request)); return; }
  event.respondWith(networkFirst(event));
});
