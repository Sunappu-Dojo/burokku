const buffers = []

/**
 * Fetches sound, returns ArrayBuffer.
 */
function fetchAndReturnBuffer(url) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(audioData => audioData)
}

/**
 * Returns audio bytes from URL.
 */
export async function getAudioFrom(url) {

  // Fetch and store audio bytes.
  if (!(url in buffers)) {
    buffers[url] = await fetchAndReturnBuffer(url)
  }

  // Return a clone of the stored audio data.
  return buffers[url].slice(0)
}
