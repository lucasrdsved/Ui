const CACHE_NAME = 'treinos-pt-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation fallback for SPA (Single Page Application)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((response) => {
        return response || fetch(event.request).catch(() => {
           return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for other resources
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        // Cache new response
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
           // Only cache GET requests
           if (event.request.method === 'GET') {
             try {
                cache.put(event.request, responseToCache);
             } catch (e) {
                // Ignore errors for opaque responses or quota limits
             }
           }
        });

        return networkResponse;
      }).catch(() => {
         // Network failed, nothing else to do if not in cache
      });

      return cachedResponse || fetchPromise;
    })
  );
});