import Rumble from '../../helpers/Rumble'
import Sfx    from '../../helpers/Sfx'

import { useSounds, SOUNDS, CSS, THROTTLE } from './config'

export default class Block {
  constructor(id) {
    this.btn = document.getElementById(id)
    this.coins = this.btn.getElementsByClassName(CSS.coins)

    this.flippingCoins = document.getElementsByClassName(CSS.flippingCoin)

    this.canBump = true
    this.canBumpTimer = null

    this.makeSounds()
  }

  focus() {
    this.btn.focus()
  }

  bumpBlock() {
    this.resetBump(() => {
      this.btn.classList.add(CSS.hit)
      this.vibrate()
      this.playSounds()
    })
  }

  throttleBump() {
    this.canBump = false
    this.canBumpTimer = setTimeout(() => this.canBump = true, THROTTLE)
  }

  /**
   * Reset bump animation
   */
  resetBump(callback) {
    this.btn.classList.remove(CSS.hit)
    this.btn.style.setProperty('animation', 'none')

    requestAnimationFrame(() => {
      this.btn.style.removeProperty('animation')
      requestAnimationFrame(callback)
    })
  }

  throwCoin(coin, dispatchEvent = true) {
    coin.classList.add(CSS.flippingCoin)

    if (dispatchEvent) {
      document.dispatchEvent(new CustomEvent('coinThrow', { detail: 1 }))
    }
  }

  vibrate() {
    Rumble.vibrate([40, 230, 10])
  }

  playSounds() {
    Sfx.play(this.bump)
    this.makeSounds()
  }

  makeSounds() {
    this.bump = Sfx.makeFrom(SOUNDS.bump)
  }

  onBlockChange() {
    useSounds(this.btn.id)
    this.makeSounds()
  }

  onTap({ target, isTrusted }) {
    if (
      !this.canBump
      || target != this.btn
      || this.flippingCoins.length == this.coins.length
    ) {
      return
    }

    /**
     * In addition to giving a good feeling to the app, it prevents to hit the
     * block twice when pressing space because space triggers `keydown` and
     * `keydown` successively. It would feel bad without bump throttling.
     */
    this.throttleBump()

    // Get first available coin.
    const coin = Array.from(this.coins)
      .find(coinEl => !coinEl.classList.contains(CSS.flippingCoin))

    if (!coin) { return }

    this.bumpBlock()
    this.throwCoin(coin, isTrusted)
  }

  /**
   * onEnter differs from onSpace because:
   * - Holding down Space doesn’t trigger repetition on a button, Enter does.
   * - Pressing Enter on a link must follow it, Space doesn’t.
   */

  onEnter({ target }) {
    if (
      target != this.btn
      && !['A', 'BUTTON'].includes(target.tagName)
    ) {
      this.focus()
    }
  }

  onSpace(e) {
    if (!(e.target === this.btn)) {
      if (e.target.tagName === 'BUTTON') { return }
      this.focus()
    }

    // hit the block
    this.onTap(e)
  }

  onAnimationEnd({ target }) {
    if (target.classList.contains(CSS.flippingCoin)) {
      return target.classList.remove(CSS.flippingCoin)
    }

    if (target.classList.contains(CSS.btnInner)) {
      return this.btn.classList.remove(CSS.hit)
    }
  }

  onTransitionEnd({ target }) {
    if (target === this.btn) {
      this.focus()
    }
  }
}
