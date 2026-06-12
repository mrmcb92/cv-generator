// Service worker for Generator CV — offline support + installability.
// Bump VERSION to invalidate old caches on the next visit.
const VERSION = "v1";
const CACHE = `cv-generator-${VERSION}`;

// App shell + assets that make the app usable offline. The fonts are
// precached so PDF export with Romanian diacritics works without network.
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/fonts/Roboto-Regular.ttf",
  "/fonts/Roboto-Bold.ttf",
  "/fonts/Roboto-Italic.ttf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // ignore individual failures so one missing asset can't block install
      .then((cache) => Promise.allSettled(PRECACHE.map((u) => cache.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first so online users always get fresh HTML,
  // falling back to the cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Hashed bundles, fonts and icons are immutable: cache-first.
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/icon")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Everything else: cache, then network.
  event.respondWith(caches.match(request).then((r) => r || fetch(request)));
});
