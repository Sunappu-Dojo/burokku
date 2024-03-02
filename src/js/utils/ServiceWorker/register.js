/**
 * Register the Service Worker.
 *
 * @param {string} path Path of the Service Worker.
 */
export const register = path => {
  if (!navigator.serviceWorker.controller) {
    navigator.serviceWorker.register(path)
  }
}
