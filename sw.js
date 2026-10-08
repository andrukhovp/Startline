/*
 * Startline service worker: lets the app open and run offline.
 *
 * The app's own files are fetched from the network first, so you always get
 * the latest version when you're online, and from the cache when you're not.
 * Fonts come from the cache first because their files never change.
 * Account requests (Supabase) are never cached.
 *
 * Bump VERSION only when this file's logic changes; content updates to the
 * other files are picked up automatically.
 */
const VERSION = "v1";
const APP_CACHE = "startline-app-" + VERSION;
const FONT_CACHE = "startline-fonts-" + VERSION;
const SHELL = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "platform.js",
  "config.js",
  "vendor/supabase.js",
  "manifest.webmanifest",
  "icons/favicon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" })))));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("startline-") && k !== APP_CACHE && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

// Network first, with a time limit so a weak connection falls back to the cache.
async function networkFirst(request, cacheKey) {
  const cache = await caches.open(APP_CACHE);
  try {
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    if (response && response.ok && response.type === "basic") cache.put(cacheKey || request, response.clone());
    return response;
  } catch (e) {
    const hit = await cache.match(cacheKey || request, { ignoreSearch: true });
    if (hit) return hit;
    throw e;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(FONT_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response && (response.ok || response.type === "opaque")) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(FONT_CACHE);
  const hit = await cache.match(request);
  const update = fetch(request).then((response) => { if (response && response.ok) cache.put(request, response.clone()); return response; }).catch(() => hit);
  return hit || update;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") event.respondWith(networkFirst(request, "./"));
    else event.respondWith(networkFirst(request));
  } else if (url.hostname === "fonts.gstatic.com") {
    event.respondWith(cacheFirst(request));
  } else if (url.hostname === "fonts.googleapis.com") {
    event.respondWith(staleWhileRevalidate(request));
  }
  // Everything else (your account, the sites you open) goes straight to the network.
});
