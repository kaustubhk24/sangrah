/* eslint-disable no-restricted-globals */

// This is the service worker for the app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('offline-cache').then((cache) => {
      return cache.addAll([
        '/offline.html',
        '/search-doc-*.json'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Remove old cache
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== 'offline-cache') {
              return caches.delete(key);
            }
          })
        )
      ),
    ])
  );
});

// Handle offline navigation
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/offline.html');
        })
    );
  } else if (event.request.url.includes('search-doc-')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
    );
  }
});