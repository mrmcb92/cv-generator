const CACHE_NAME = "cv-generator-v2";
const STATIC_CACHE = "cv-generator-static-v2";
const RUNTIME_CACHE = "cv-generator-runtime-v2";

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/fonts/Roboto-Regular.ttf",
  "/fonts/Roboto-Bold.ttf",
  "/fonts/Roboto-Italic.ttf",
  "/icon-192.png",
  "/icon-512.png",
];

// ── Install: cache static assets ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: claim clients + delete old caches ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== RUNTIME_CACHE && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
      // Enable navigation preload
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })()
  );
});

// ── Fetch: network-first for navigations, stale-while-revalidate for everything else ──
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip Next.js HMR and dev-only requests
  if (url.pathname.startsWith("/_next/") && url.pathname.includes("hot-update")) return;

  // Navigation requests: network-first with navigation preload support
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Try navigation preload first
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) return preloadResponse;

          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          const cached = await caches.match(request);
          return cached ?? new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Static assets (/_next/static, /fonts, /icons): cache-first
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/fonts") ||
    url.pathname.startsWith("/icon-")
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return new Response("", { status: 404 });
        }
      })()
    );
    return;
  }

  // Everything else (API calls, pages): stale-while-revalidate
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) {
        // Fire-and-forget update in background
        fetch(request)
          .then((res) => {
            if (res && res.status === 200) {
              caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, res));
            }
          })
          .catch(() => {});
        return cached;
      }
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return new Response("Offline", { status: 503 });
      }
    })()
  );
});
