/*
  Hollywood Coon — Service Worker
  Cache-First for static assets, Network-First for HTML

  Cloudflare setup:
  - Speed > Optimization > HTTP/3 (QUIC) = ON
  - Speed > Optimization > Brotli = ON
  - Caching > Cache Rules: Cache Everything for /css/* /js/* /fonts/*
*/

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const HTML_CACHE = `html-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  'css/variables.css',
  'css/base.css',
  'css/components.css',
  'js/nav.js',
  'js/lightbox.js',
  'js/form.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then(c => c.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== HTML_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;

  if (request.destination === 'document') {
    /* === Network-First for HTML === */
    e.respondWith(
      fetch(request)
        .then(r => {
          caches.open(HTML_CACHE).then(c => c.put(request, r.clone()));
          return r;
        })
        .catch(() => caches.match(request))
    );
  } else {
    /* === Cache-First for static assets === */
    e.respondWith(
      caches.match(request).then(r => r || fetch(request))
    );
  }
});
