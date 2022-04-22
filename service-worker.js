// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache

//local test
//const preCacheResources = ['/', '/app.js', '/schoolData.json', '/service-worker.js', '/manifest.json'];

//deploy
const preCacheResources = ['/313-project/', '/313-project/index.html', '/313-project/style.css', '/313-project/app.js', '/313-project/schoolData.json'];


// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('[Service worker] install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(preCacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('[Service worker] activate event!');
  self.clients.claim();
  const clearCache = async () => {
    const keys = await caches.keys();
    keys.forEach(async (k) => {
      if (cacheName.includes(k)) {
        return;
      }
      await caches.delete(k);
    });
  };
  event.waitUntil(clearCache());
});


// Network first, otherwise fall back to cache
self.addEventListener('fetch', (event) => {
  console.log('[Service worker] Fetch intercepted for:', event.request.url);
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
