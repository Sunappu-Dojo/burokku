/**
 * This script is the same as `src/js/helpers/Storage/idb.js`, except:
 * - it doesn’t require support for top-level `await`;
 * - the IndexedDB detection part is in `src/js/helpers/Storage/idbDetect.js`.
 *
 * As a result, the detection of IndexedDB is done earlier (it doesn’t require
 * `idb-keyval`), but is asynchronous, meaning that when running a function
 * exported from this file (`idbGet` or `idbSet`), we might still try to
 * hit IndexedDB: unless we are completely sure that IndexedDB is not
 * available, the functions never **directly** resolve the Promise.
 *
 * Maybe we should always run this version of the code, as it runs earlier for
 * a cost of < 200 bytes (gzip), but that is some more process to maintain:
 * 1. We have to inline some code in index.html;
 * 2. We can’t rely on `idb-keyval` existing code for the detection.
 */

import { get, set, createStore } from 'idb-keyval'

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
  idbAvailabilityDetected && !idbAvailable
    ? Promise.resolve(fallback)
    : get(key, customStore)
      .then(value => typeof value != 'undefined' ? value : fallback)
      .catch(() => Promise.resolve(fallback))

/**
 * Save a value in IndexedDB.
 *
 * It always returns a Promise resolving to void. Never rejects, never throws.
 *
 * @param {IDBValidKey} key IndexedDB key where to store the value.
 * @param {*} value         The value to store in IndexedDB.
 * @param {import('idb-keyval').UseStore} [customStore=undefined] `idb-keyval` custom store.
 * @returns {Promise<void>} Nothing.
 */
const idbSet = (key, value, customStore = undefined) =>
  idbAvailabilityDetected && !idbAvailable
    ? Promise.resolve()
    : set(key, value, customStore).catch(err => console.error(err) && Promise.resolve())

export { idbGet, idbSet, createStore }
