/** @type {Record<string, ArrayBuffer>} */
const buffers = {}

/**
 * Fetches a sound and returns its ArrayBuffer.
 * @param {string} url
 */
const fetchAndReturnBuffer = url =>
  fetch(url).then(response => response.arrayBuffer())

/**
 * Returns audio bytes from URL.
 *
 * @param {string} url
 * @returns {Promise<ArrayBuffer>}
 */
export const getAudioFrom = async url =>

  // Fetch and store audio bytes.
  (buffers[url] ??= await fetchAndReturnBuffer(url))

  // Return a clone of the stored audio data.
    .slice(0)
