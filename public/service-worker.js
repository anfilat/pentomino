const cacheName = 'cache-and-update-v1';
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
    event.respondWith(fromCache(event.request));
    event.waitUntil(update(event.request));
});

function fromCache(request) {
    return caches
        .open(cacheName)
        .then(cache => {
            return cache
                .match(request)
                .then(response => response || fetch(request));
        });
}

function update(request) {
    return caches
        .open(cacheName)
        .then(cache => {
            return fetch(request)
                .then(response => cache.put(request, response))
        });
}
