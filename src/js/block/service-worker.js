/**
 * Service worker strategy: network first, fallback on cache.
 */

const SW_VERSION = '1.0'
const resourcesCacheKey = `cache-v${SW_VERSION}`

const resourcesToCache = [
  '/',
  'site.webmanifest',

  'css/block.css',
  'js/block.js',
  'js/modules/service-worker.js',

  'sfx/smb-bump.flac',
  'sfx/smb-coin.flac',
  'sfx/smb-1up.flac',

  // Fonts
  'fonts/oxygen-regular.woff2',

  // Standard icons
  'favicon.svg',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',

  // Maskable
  'android-chrome-maskable-192x192.png',
  'android-chrome-maskable-512x512.png',

  // Apple icons
  'apple-touch-icon.png',
  'safari-pinned-tab.svg',

  // Microsoft icons tiles
  'browserconfig.xml',
  'mstile-70x70.png',
  'mstile-150x150.png',
  'mstile-310x150.png',
  'mstile-310x310.png',

  // Old stuff
  'favicon-32x32.png',
  'favicon-16x16.png',
]

const createCaches = () =>
  caches.open(resourcesCacheKey).then(cache => cache.addAll(resourcesToCache))

const flushOldCaches = () => caches.keys().then(keys => Promise.all(
  keys
    .filter(key => key !== resourcesCacheKey)
    .map(key => caches.delete(key))
))

const putToCache = (cacheKey, request, response) =>
  caches.open(cacheKey).then(cache => cache.put(request, response))

const respondWith = (e, url) =>
  e.respondWith(fetch(url)
    .then(response => response)
    .catch(err =>
      caches.match(url, { ignoreSearch: true }).then(response => response)
    )
  )

self.addEventListener('install', e =>
  e.waitUntil(createCaches().then(() => self.skipWaiting()))
)

self.addEventListener('activate', e =>
  e.waitUntil(flushOldCaches().then(() => self.clients.claim()))
)

self.addEventListener('fetch', e => respondWith(e, e.request))
