import { get, set, del, createStore } from 'idb-keyval'

/**
 * Availability of IndexedDB.
 *
 * Known situations where IndexedDB isn’t available:
 * - Firefox private mode (https://bugzilla.mozilla.org/show_bug.cgi?id=781982)
 * - Chromium with cookies disabled (tested in Chromium 108)
 * - Firefox with cookies disabled (tested in Firefox 108)
 * - Safari with cookies disabled (tested in Safari 16.2)
 *
 * The detection requires support of top-level `await`, starting at Safari 15.
 * For broader browsers support, use `./idbLegacy.js`.
 *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#browser_compatibility
 *
 * @type {boolean}
 */
let idbAvailable = false

try {
  await get('coins-amount')
  idbAvailable = true
} catch (err) {}

/**
 * Retrieve an item from a default IndexedDB storage.
 *
 * If `window.indexedDB` is not available or if the wanted item does not exist,
 * returns a Promise always resolving to the value of the provided fallback.
 * Never rejects, never throws.
 *
 * @param  {IDBValidKey} key        Wanted IndexedDB key.
 * @param  {*} [fallback=undefined] Fallback value.
 * @param {import('idb-keyval').UseStore} [customStore=undefined] `idb-keyval` custom store.
 * @returns {Promise<*|undefined>}  Found value, or fallback.
 */
const idbGet = (key, fallback = undefined, customStore = undefined) =>
  idbAvailable
    ? get(key, customStore)
      .then(value => typeof value != 'undefined' ? value : fallback)
      .catch(() => Promise.resolve(fallback))
    : Promise.resolve(fallback)

/**
 * Save a value in an IndexedDB default storage.
 *
 * It always returns a Promise resolving to void. Never rejects, never throws.
 *
 * @param {IDBValidKey} key IndexedDB key where to store the value.
 * @param {*} value         The value to store in IndexedDB.
 * @param {import('idb-keyval').UseStore} [customStore=undefined] `idb-keyval` custom store.
 * @returns {Promise<void>} Nothing.
 */
const idbSet = (key, value, customStore = undefined) => idbAvailable
  ? set(key, value, customStore).catch(err => console.error(err) && Promise.resolve())
  : Promise.resolve()

/**
 * Delete an item in an IndexedDB default storage.
 *
 * It always returns a Promise resolving to void. Never rejects, never throws.
 *
 * @param {IDBValidKey} key IndexedDB key to delete.
 * @param {import('idb-keyval').UseStore} [customStore=undefined] `idb-keyval` custom store.
 * @returns {Promise<void>} Nothing.
 */
const idbDel = (key, customStore = undefined) => idbAvailable
  ? del(key, customStore).catch(err => console.error(err) && Promise.resolve())
  : Promise.resolve()

export { idbAvailable, idbGet, idbSet, idbDel, createStore }
