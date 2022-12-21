import { get, set } from 'idb-keyval'

/**
 * Availability of IndexedDB.
 *
 * Known situations where it will fail:
 * - Firefox private mode (https://bugzilla.mozilla.org/show_bug.cgi?id=781982)
 * - Chromium with cookies disabled (tested in Chromium 108)
 * - Firefox with cookies disabled (tested in Firefox 108)
 * - Safari with cookies disabled (tested in Safari 16.2)
 *
 * @type {boolean}
 */
let indexedDBAvailable = false

/**
 * This code requires support of top-level `await`, which starts at Safari 15.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#browser_compatibility
 *
 */
try {
  await get('coins-amount')
  indexedDBAvailable = true
} catch (err) {
  console.info('indexedDB not available, data won’t be saved.')
}

/**
 * Retrieve an item from IndexedDB. If `window.indexedDB` is not available or
 * if the wanted item doesn’t exist, it will return the provided fallback.
 *
 * @param  {IDBValidKey} key        Wanted IndexedDB key.
 * @param  {*} [fallback=undefined] Fallback value.
 * @return {Promise<*>}
 *
 */
const idbGet = (key, fallback = undefined) => indexedDBAvailable
  ? get(key).then(value => typeof value != 'undefined' ? value : fallback)
  : Promise.resolve(fallback)

/**
 * Save a value in IndexedDB.
 *
 * @param {IDBValidKey} key IndexedDB key where to store the value.
 * @param {*} value The value to store in IndexedDB.
 * @returns {Promise<void>}
 *
 */
const idbSet = (key, value) => indexedDBAvailable
  ? set(key, value)
  : Promise.resolve()

export { idbGet, idbSet, indexedDBAvailable }
