let enabled = true

/**
 * A class with static methods for easier vibrations management.
 * It doesn’t fail if the Vibration API isn’t supported.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 *
 * Examples:
 *
 * ```
 * // vibrate with force 50
 * Rumble.vibrate(50)
 *
 * // vibrate with force 50, then wait 500ms, then vibrate with force 100
 * Rumble.vibrate([50, 500, 100])
 *
 * // stop all vibrations
 * Rumble.vibrate()
 * Rumble.vibrate([])
 *
 * // Detect if the Vibration API if supported (theoretical)
 * Rumble.supported
 *
 * Rumble.toggle()        // toggle vibrations on/off
 * Rumble.toggle(true)    // no more vibrations
 * Rumble.toggle(false)   // vibrations are back
 * ```
 */
export default class Rumble {
  static get supported() {
    return 'vibrate' in navigator
  }

  /**
   * Vibrate following a provided pattern.
   *
   * @param {VibratePattern} vibrationPattern A list of vibration forces (odd numbers) separated by pauses (even numbers).
   *
   * @returns {void}
   */
  static vibrate(vibrationPattern) {
    if (this.supported && enabled) {
      navigator.vibrate(vibrationPattern)
    }
  }

  /**
   * Enable or disable vibrations.
   *
   * @param {boolean} state `true` to enable, `false` to disable
   *
   * @returns {void}
   */
  static toggle(state = !enabled) {
    if (!state) {
      this.vibrate(0) // stop ongoing vibrations
    }

    enabled = state
  }
}
