// static/service-worker.js
self.addEventListener('install', (e) => {
  console.log('Service Worker installed');
  e.waitUntil(
    caches.open('jarvis-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/static/main.js',
        '/static/icon-192.png',
        '/static/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
