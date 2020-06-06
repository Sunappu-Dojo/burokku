import Sfx from '../../helpers/Sfx/index'
import Wallet from './Wallet'

import { SOUNDS, CSS, THROTTLE } from './config'

export default class Block {
  constructor() {
    this.btn = document.getElementsByClassName(CSS.btn)[0]
    this.coins = document.getElementsByClassName(CSS.coins)
    this.flippingCoins = document.getElementsByClassName(CSS.flippingCoin)
    this.wallet = new Wallet()

    this.canBump = true
    this.canBumpTimer = null

    this.makeSounds()
  }

  bumpBlock() {
    this.resetBump()
    this.btn.classList.add(CSS.hit)
    this.playSounds()
  }

  throttleBump() {
    this.canBump = false
    this.canBumpTimer = setTimeout(() => {
      this.canBump = true
    }, THROTTLE)
  }

  /**
   * Reset bump animation
   *
   * https://medium.com/better-programming/how-to-restart-a-css-animation-with-javascript-and-what-is-the-dom-reflow-a86e8b6df00f
   */
  resetBump() {
    this.btn.classList.remove(CSS.hit)
    this.btn.style.animation = 'none'
    this.btn.offsetHeight // trigger reflow
    this.btn.style.animation = null
  }

  giveCoin(coin) {
    coin.classList.add(CSS.flippingCoin)
    this.wallet.add(1)
  }

  playSounds() {
    Sfx.play(this.bump)
    this.makeSounds()
  }

  makeSounds() {
    this.bump = Sfx.makeFrom(SOUNDS.bump)
  }

  onTap({ target }) {
    if (
      !this.canBump
      || target != this.btn
      || this.flippingCoins.length == this.coins.length
    ) {
      return
    }

    this.throttleBump()

    // Get first available coin.
    const coin = Array.from(this.coins)
      .find(coinEl => !coinEl.classList.contains(CSS.flippingCoin))

    if (!coin) { return }

    this.bumpBlock()
    this.giveCoin(coin)
  }

  onAnimationEnd({ animationName, target }) {
    if (target.classList.contains(CSS.flippingCoin)) {
      return target.classList.remove(CSS.flippingCoin)
    }

    if (target.classList.contains(CSS.btnInner)) {
      return this.btn.classList.remove(CSS.hit)
    }
  }
}
