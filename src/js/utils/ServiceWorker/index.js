import { register } from './register'
import { setupAppInstall } from './appInstall'

/**
 * Register the Service Worker and configure prompt and installation callbacks.
 *
 * @param {string} path Path of the Service Worker.
 * @param {AppInstallOptions?} options
 * @returns {Function|void} A function that you can store to later prompt the user for website installation.
 */
export const initServiceWorker = (path, options = {}) => {
  register(path)

  return setupAppInstall(options)
}
