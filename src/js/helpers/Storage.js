import { get as idbGet, set as idbSet } from 'idb-keyval'

/**
 * Test if indexedDB is available.
 * @type {boolean}
 */
let indexedDBAvailable = false

/**
 * Known situations where it will fail:
 * - Firefox private mode (https://bugzilla.mozilla.org/show_bug.cgi?id=781982)
 * - Chromium with cookies disabled (tested in Chromium 108)
 * - Firefox with cookies disabled (tested in Firefox 108)
 * - Safari with cookies disabled (tested in Safari 16.2)
 */
try {
  await idbGet('coins-amount')
  indexedDBAvailable = true
} catch (err) {
  console.info('indexedDB not available, data won’t be saved.')
}

export { indexedDBAvailable }
