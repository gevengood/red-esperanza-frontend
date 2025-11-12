// Service Worker para Red Esperanza PWA
const CACHE_NAME = 'red-esperanza-v1';

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim())
  );
});

// Interceptar requests - solo red, sin cache
self.addEventListener('fetch', (event) => {
  // Solo cachear GET requests de la misma origin
  if (event.request.method !== 'GET' || 
      !event.request.url.startsWith(self.location.origin)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear respuestas exitosas de recursos estáticos
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          }).catch(() => {
            // Ignorar errores de cache silenciosamente
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intentar del cache
        return caches.match(event.request);
      })
  );
});
