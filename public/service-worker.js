const cacheName = 'cache-v2';
const filesToCache = [
    './index.html',
    './global.css',
    './build/bundle.css',
    './build/bundle.js',
    './build/worker.js',
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => cache.addAll(filesToCache))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(thisCacheName => {
                        if (thisCacheName !== cacheName) {
                            return caches.delete(thisCacheName);
                        }
                    })
                );
            })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches
            .open(cacheName)
            .then(cache => {
                return cache
                    .match(event.request)
                    .then(response => response || fetch(event.request));
            })
    );
});
