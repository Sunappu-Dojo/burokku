const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()

import { getAudioFrom } from './helpers'

/**
 * A class with static methods that help fetching and playing sounds using the
 * browser AudioContext API.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
 *
 * Example:
 *
 * const mySound = Sfx.makeFrom('my/sound/url.mp3')
 * Sfx.play(mySound) // or Sfx.play(mysound, 2)
 */
export default class Sfx {

  /**
   * Returns ready-to-play sound from URL.
   */
  static makeFrom(url) {
    if (!url) { return null }

    const source = audioContext.createBufferSource()

    getAudioFrom(url).then(audioData => {

      // Consume audio node and attach it to the output
      audioContext.decodeAudioData(audioData, decodedData => {
        source.buffer = decodedData
        source.connect(audioContext.destination)
      })
    })

    return source
  }

  /**
   * Play sound at given time.
   */
  static play(bufferSourceNode, delayInSeconds = 0) {
    if (!bufferSourceNode) { return }

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    bufferSourceNode.start(audioContext.currentTime + delayInSeconds)
  }
}
