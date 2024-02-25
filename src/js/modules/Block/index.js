// import { getAttributes } from '../../utils/Document'
import Rumble from '../../utils/Rumble'
import Sfx    from '../../utils/Sfx'
import { rAF } from '../../utils/Window'

import { useSounds, SOUNDS, CSS, THROTTLE } from './config'

const $flippingCoins = document.getElementsByClassName(CSS.flippingCoin)

export default class Block {
  #$btn = null
  #$coins = null

  #coinSize = {}

  #id
  #canBump = true
  #sfx

  get id() {
    return this.#id
  }

  get game() {
    return this.#$btn.dataset.game
  }

  get coinSize() {
    if (!this.#coinSize.width) {
      // // Alternative implementation.
      // this.#coinSize = getAttributes(this.#$coins[0].querySelector('svg'), 'width', 'height')

      const { width: { value: width }, height: { value: height } } = this.#$coins[0].querySelector('svg').attributes
      this.#coinSize = { width, height }
    }

    return this.#coinSize
  }

  constructor(id) {
    this.#id = id
    this.#$btn = document.getElementById(id)
    this.#$coins = this.#$btn.getElementsByClassName(CSS.coins)

    this.#makeSounds()
  }

  focus() {
    this.#$btn.focus()
  }

  trigger() {
    this.#$btn.dispatchEvent(new Event('click'))
  }

  #bumpBlock() {
    this.#resetBump(() => {
      this.#$btn.classList.add(CSS.hit)
      this.#vibrate()
      this.#playSounds()
    })
  }

  #throttleBump() {
    this.#canBump = false
    setTimeout(() => this.#canBump = true, THROTTLE)
  }

  /**
   * Reset bump animation
   */
  #resetBump(callback) {
    this.#$btn.classList.remove(CSS.hit)
    this.#$btn.style.setProperty('animation', 'none')

    rAF(() => {
      this.#$btn.style.removeProperty('animation')
      rAF(callback)
    })
  }

  #throwCoin(coin, dispatchEvent = true) {
    coin.classList.add(CSS.flippingCoin)

    if (dispatchEvent) {
      document.dispatchEvent(new CustomEvent('coinThrow', { detail: 1 }))
    }
  }

  #makeSounds() {
    this.#sfx = Sfx.makeFrom(SOUNDS.bump)
  }

  #playSounds() {
    Sfx.play(this.#sfx)
    this.#makeSounds()
  }

  #vibrate() {
    Rumble.vibrate([40, 230, 10])
  }

  onBlockChange() {
    useSounds(this.#id)
    this.#makeSounds()
  }

  onTap({ target, isTrusted }) {
    if (
      !this.#canBump
      || target != this.#$btn
      || $flippingCoins.length == this.#$coins.length
    ) {
      return
    }

    /**
     * In addition to giving a good feeling to the app, it prevents to hit the
     * block twice when pressing space because space triggers `keydown` and
     * `keydown` successively. It would feel bad without bump throttling.
     */
    this.#throttleBump()

    // Get first available coin.
    const coin = Array.from(this.#$coins)
      .find(coinEl => !coinEl.classList.contains(CSS.flippingCoin))

    if (!coin) { return }

    this.#bumpBlock()
    this.#throwCoin(coin, isTrusted)
  }

  /**
   * Keyboard shortcuts: Enter, Space.
   *
   * Differences between Enter and Space:
   * - holding down Enter triggers repetition on a button, but Space does not,
   *   so we have to manually trigger it (using `onTap`) on Space press.
   * - pressing Enter on a link must follow it, Space does not.
   */

  onEnter({ target }) {
    /**
     * Focus the block, unless…
     * - it’s already focused;
     * - the focus is already on a button or a link.
     */
    if (
      target != this.#$btn
      && !['A', 'BUTTON'].includes(target.tagName)
    ) {
      this.focus()
    }
  }

  onSpace(e) {
    /**
     * Focus the block, unless…
     * - it’s already focused;
     * - the focus is already on a button.
     */
    if (e.target != this.#$btn) {
      if (e.target.tagName === 'BUTTON') { return }
      this.focus()
    }

    // hit the block
    this.onTap(e)
  }

  /**
   * Animation and transition events
   */

  onAnimationEnd({ target }) {
    if (target.classList.contains(CSS.flippingCoin)) {
      return target.classList.remove(CSS.flippingCoin)
    }

    if (target.classList.contains(CSS.btnInner)) {
      return this.#$btn.classList.remove(CSS.hit)
    }
  }

  onTransitionEnd({ target }) {
    if (target === this.#$btn) {
      this.focus()
    }
  }
}
