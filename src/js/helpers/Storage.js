import { get as idbGet } from 'idb-keyval'

/**
 * Test if indexedDB is available.
 * @type {boolean}
 */
let indexedDBAvailable = false

try {
  await idbGet('coins-amount')
  indexedDBAvailable = true
} catch (err) {
  console.info('indexedDB not available, data won’t be saved.')
}

export { indexedDBAvailable }
