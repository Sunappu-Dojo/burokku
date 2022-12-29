/**
 * Detect IndexedDB availability.
 *
 * Known situations where it will fail:
 * - Firefox private mode (https://bugzilla.mozilla.org/show_bug.cgi?id=781982)
 * - Chromium with cookies disabled (tested in Chromium 108)
 * - Firefox with cookies disabled (tested in Firefox 108)
 * - Safari with cookies disabled (tested in Safari iOS 14.5 and macOS 16.2)
 *
 * It creates two global variables to hold the availability of IndexedDB:
 * - `idbAvailabilityDetected` let you know if the detection has fully
 *                             run (it’s an asynchronous operation).
 * - `idbAvailable` is `false` until the detection is fully done.
 *
 * This code should be run as soon as possible: for example as
 * an inline `<script>` in your entry HTML `<head>`.
 *
 * The whole code is wrapped into a `try… catch` block because `indexedDB.open`
 * fails on Safari when IndexedDB is not available. Optional chaining could
 * be used instead of the `try… catch`, but it requires Safari iOS 13.4,
 * and we still support Safari iOS 12.2.
 */
try {
  const idbRequest = indexedDB.open('idb-detect-db')

  idbRequest.onerror = () => idbAvailabilityDetected = true

  idbRequest.onsuccess = () => {
    indexedDB.deleteDatabase('idb-detect-db')
    idbAvailable = true
    idbAvailabilityDetected = true
  }
} catch (err) {
  idbAvailabilityDetected = true
}
