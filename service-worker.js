// Choose a cache name
const cacheName = 'cache-v1';
// List the files to precache

//local test
//const preCacheResources = ['/', '/app.js', '/schoolData.json', '/service-worker.js', '/manifest.json', '/index.html'];

//deploy
const preCacheResources = ['/313-project/', '/313-project/index.html', '/313-project/style.css', '/313-project/app.js', '/313-project/schoolData.json'];


// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
  console.log('[Service worker] install event!');
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(preCacheResources)));
});

self.addEventListener('activate', (event) => {
  console.log('[Service worker] activate event!');
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();

    await Promise.all(cacheNames.map(async (cacheName) => {
      if (self.cacheName !== cacheName) {
        await caches.delete(cacheName);
      }
    }));
  })());
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
