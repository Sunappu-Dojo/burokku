/**
 * This file is the same as Sfx.js for browsers supporting the Promise-based
 * syntax for AudioContext.decodeAudioData(). See lines 34-39. It is not
 * used in the app. When Safari will move forward, the way this file
 * structures and uses `decodeAudioUrl` will be a better choice.
 * Please note helpers are not extracted from this file yet.
 *
 * ⚠️ The code in this file is not on par with index.js.
 * No change needed before dropping iOS Safari 14.4.
 */

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()

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
 * Returns audio node from URL.
 */
async function decodeAudioUrl(url) {
  if (!(url in buffers)) {
    buffers[url] = await fetchAndReturnBuffer(url)
  }

  // Clone audio data, then consume the clone.
  const audioData = buffers[url].slice(0)

  /**
   * Promise-based syntax, supported starting Safari 14.1 (macOS) or 14.5 (iOS).
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData#New_promise-based_syntax
   */
  return audioContext.decodeAudioData(audioData, decodedData => decodedData)
}

/**
 * Resume suspended audio context.
 */
function resumeAudioContext() {
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
}

/**
 * A static class to fetch and play sounds.
 */
export default class Sfx {

  /**
   * Returns ready-to-play sound from URL.
   */
  static makeFrom(url) {
    const source = audioContext.createBufferSource()

    decodeAudioUrl(url).then(buffer => {
      source.buffer = buffer
      source.connect(audioContext.destination)
    })

    return source
  }

  /**
   * Play sound at given time.
   */
  static play(bufferSourceNode, delay = 0) {
    resumeAudioContext()
    bufferSourceNode.start(audioContext.currentTime + delay)
  }
}
