/* Star Kids Playground - service worker
   Saves every page for offline play and reports progress to open pages. */
const VERSION = 'star-kids-v5';
const FONT_CACHE = 'star-kids-fonts-v1';

const CORE = [
  './',
  './index.html',
  './manifest.json',
  './apps/planet.html',
  './apps/kitten.html',
  './apps/coloring.html',
  './apps/target.html',
  './apps/shapes.html',
  './apps/music.html',
  './apps/feeding.html',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  // talking kitten photos
  './assets/kitten/kitten-sit.png',
  './assets/kitten/kitten-tilt.png',
  './assets/kitten/kitten-face.png',
  // planet maps (bundled copy + separate files)
  './assets/images/planet-maps.js',
  './assets/images/2k_sun.jpg',
  './assets/images/2k_mercury.jpg',
  './assets/images/2k_venus_atmosphere.jpg',
  './assets/images/2k_earth_daymap.jpg',
  './assets/images/2k_earth_clouds.jpg',
  './assets/images/2k_moon.jpg',
  './assets/images/2k_mars.jpg',
  './assets/images/2k_jupiter.jpg',
  './assets/images/2k_saturn.jpg',
  './assets/images/2k_saturn_ring_alpha.png',
  './assets/images/2k_uranus.jpg',
  './assets/images/2k_neptune.jpg',
  './assets/images/pluto.jpg'
];

async function tell(msg) {
  const all = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  all.forEach(c => c.postMessage(msg));
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    let done = 0;
    for (const url of CORE) {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res.ok) await cache.put(url, res);
      } catch (e) { /* keep going; it will be cached on first use */ }
      done++;
      tell({ type: 'sw-progress', done, total: CORE.length });
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION && k !== FONT_CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
    tell({ type: 'sw-ready' });
  })());
});

self.addEventListener('message', event => {
  if (event.data === 'status') {
    caches.open(VERSION).then(c => c.keys()).then(keys => {
      event.source && event.source.postMessage({ type: 'sw-status', cached: keys.length, total: CORE.length });
    });
  }
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: show cached copy at once, refresh in the background
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith((async () => {
      const cache = await caches.open(FONT_CACHE);
      const hit = await cache.match(req);
      const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Pages: newest copy from the network, saved copy when offline
  if (req.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith((async () => {
      const cache = await caches.open(VERSION);
      try {
        const res = await fetch(req, { cache: 'no-cache' });
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (e) {
        return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // Pictures and other files: saved copy first, then network (and save what we fetch)
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (e) {
      if (req.mode === 'navigate') return (await cache.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
