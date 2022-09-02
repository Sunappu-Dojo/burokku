/**
 * Service worker strategy: network first, fallback on cache.
 */

const SW_VERSION = '2.9'
const NETWORK_TIMEOUT = 700

const resourcesCacheKey = `cache-v${SW_VERSION}`

const resourcesToCache = [
  '/',
  'site.webmanifest',

  'css/block.css',
  'js/burokku.js',
  'js/modules/service-worker.js',

  'sfx/smb-bump.flac',
  'sfx/smb-coin.flac',
  'sfx/smb-1up.flac',
  'sfx/smw-bump.flac',
  'sfx/smw-coin.flac',
  'sfx/smw-1up.flac',

  // Fonts
  'fonts/oxygen-regular.woff2',

  // Standard icons
  'favicon.svg',
  'favicon-original.svg',
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
  'favicon-32x32-original.png',
  'favicon-16x16-original.png',
]

const createCaches = () =>
  caches.open(resourcesCacheKey).then(cache => cache.addAll(resourcesToCache))

const flushOldCaches = () => caches.keys().then(keys => Promise.all(
  keys
    .filter(key => key !== resourcesCacheKey)
    .map(key => caches.delete(key))
))

// // Currently unused
// const putToCache = (cacheKey, request, response) =>
//   caches.open(cacheKey).then(cache => cache.put(request, response))

const fromCache = url =>
  caches.match(url, { ignoreSearch: true }).then(response => response)

const fromNetwork = request => new Promise((resolve, reject) => {
  const timer = setTimeout(reject, NETWORK_TIMEOUT)

  fetch(request).then(response => {
    clearTimeout(timer)
    resolve(response)
  }, reject)
})

const respondWith = e =>
  e.respondWith(fromNetwork(e.request).catch(() => fromCache(e.request)))

self.addEventListener('install', e =>
  e.waitUntil(createCaches().then(self.skipWaiting))
)

self.addEventListener('activate', e =>
  e.waitUntil(flushOldCaches().then(() => self.clients.claim()))
)

self.addEventListener('fetch', respondWith)
