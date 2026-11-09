/* ============================================
   NEXUS — SERVICE WORKER (PWA)
   Cache assets untuk offline support
   ============================================ */

const CACHE_NAME = 'nexus-v1.0.0';
const ASSETS = [
    './',
    './index.html',
    './dashboard.html',
    './login.html',
    './register.html',
    './profile.html',
    './settings.html',
    './projects.html',
    './messages.html',
    './404.html',
    './style.css',
    './app.css',
    './features.css',
    './script.js',
    './app.js',
    './features.js',
    './manifest.json'
];

// Install — cache semua asset
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS.map(a => new Request(a, { cache: 'reload' }))))
            .then(() => self.skipWaiting())
            .catch(err => console.warn('Cache install error:', err))
    );
});

// Activate — hapus cache lama
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch — network first, fallback ke cache
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache response baru
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // Offline: ambil dari cache
                return caches.match(event.request)
                    .then(cached => cached || caches.match('./index.html'));
            })
    );
});

// Message — untuk update
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});