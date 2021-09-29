import { getAudioFrom } from './helpers'

const AudioContext = window.AudioContext || window.webkitAudioContext
const audioContext = new AudioContext()
const volume = audioContext.createGain()
let volumeLevel = 1

/**
 * A class with static methods that help fetching and playing sounds using the
 * browser AudioContext API.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData
 *
 * Examples:
 *
 * const mySound = Sfx.makeFrom('my/sound/url.mp3')
 * Sfx.play(mySound) // or Sfx.play(mysound, 2)
 *
 * Sfx.setVolume(0) // no more sound
 * Sfx.setVolume(.5) // sound volume is 50%
 * Sfx.setVolume(1) // sound volume is 100%
 */
export default class Sfx {

  /**
   * Returns ready-to-play sound from URL.
   *
   * @param {string} url The URL of the sound resource.
   *
   * @returns {AudioBufferSourceNode}
   */
  static makeFrom(url) {
    if (!url) { return null }

    const source = audioContext.createBufferSource()

    getAudioFrom(url).then(audioData => {

      // Consume audio node and attach it to the output
      audioContext.decodeAudioData(audioData, decodedData => {
        source.buffer = decodedData
        source.connect(volume)
        volume.connect(audioContext.destination)
      })
    })

    return source
  }

  /**
   * Play sound at given time.
   *
   * @param {AudioBufferSourceNode} bufferSourceNode
   * @param {number=} delay Delay before the sound is played, in seconds.
   *
   * @returns {void}
   */
  static play(bufferSourceNode, delayInSeconds = 0) {
    if (!bufferSourceNode) { return }

    // Get Sound level
    volume.gain.value = volumeLevel

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    bufferSourceNode.start(audioContext.currentTime + delayInSeconds)
  }

  /**
   * Control the sound volume.
   *
   * @param {number=} level Sound volume between 0 and 1.
   *
   * @returns {void}
   */
  static setVolume(level = 1) {
    volumeLevel = level
  }
}
