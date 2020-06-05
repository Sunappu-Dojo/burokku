const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()

import { getAudioFrom } from './helpers'

/**
 * A static class to fetch and play sounds.
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
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    bufferSourceNode.start(audioContext.currentTime + delayInSeconds)
  }
}
