import { registerRoute, setCatchHandler } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { matchPrecache } from 'workbox-precaching';

export default function swCustom(params) {
  const { debug } = params;

  if (debug) {
    console.log('[Docusaurus-PWA][SW]: swCustom loaded.');
  }

  // Cache HTML pages (documents) at runtime using Stale-While-Revalidate
  registerRoute(
    ({ request }) => request.mode === 'navigate',
    new StaleWhileRevalidate({
      cacheName: 'pages-cache-v2',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache JS and CSS files at runtime (chunks for other pages)
  registerRoute(
    ({ request }) =>
      request.destination === 'script' || request.destination === 'style',
    new StaleWhileRevalidate({
      cacheName: 'static-assets-cache-v2',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache images at runtime using Cache-First
  registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
        }),
      ],
    })
  );

  // Cache fonts at runtime
  registerRoute(
    ({ request }) => request.destination === 'font',
    new CacheFirst({
      cacheName: 'fonts-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 180 * 24 * 60 * 60, // 180 days
        }),
      ],
    })
  );

  // Cache JSON files (e.g. search indexes or book lists)
  registerRoute(
    ({ request, url }) =>
      request.destination === 'json' ||
      url.pathname.endsWith('.json') ||
      url.pathname.includes('search-doc-'),
    new StaleWhileRevalidate({
      cacheName: 'json-cache-v2',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        }),
      ],
    })
  );

  // Fallback to offline.html if navigation fails
  setCatchHandler(async ({ event }) => {
    if (event.request.mode === 'navigate') {
      return matchPrecache('/offline.html');
    }
    return Response.error();
  });
}
