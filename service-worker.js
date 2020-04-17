const cacheName = 'cache-' + Date.now();
const filesToCache = [
    '/index.html',
    '/global.css',
    '/build/bundle.css',
    '/build/bundle.js',
    '/build/worker.js',
];
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(thisCacheName) {
                    if (thisCacheName !== cacheName) {
                        return caches.delete(thisCacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
