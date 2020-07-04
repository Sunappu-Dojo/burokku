import Sfx from '../../helpers/Sfx/index'
import Wallet from './Wallet'

import { SOUNDS, CSS, THROTTLE } from './config'

export default class Block {
  constructor(id) {
    this.btn = document.getElementById(id)
    this.coins = this.btn.getElementsByClassName(CSS.coins)

    this.flippingCoins = document.getElementsByClassName(CSS.flippingCoin)
    this.wallet = new Wallet()

    this.canBump = true
    this.canBumpTimer = null

    this.makeSounds()
  }

  bumpBlock() {
    this.resetBump(() => {
      this.btn.classList.add(CSS.hit)
      this.playSounds()
    })
  }

  throttleBump() {
    this.canBump = false
    this.canBumpTimer = setTimeout(() => {
      this.canBump = true
    }, THROTTLE)
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

  throwCoin(coin) {
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
    this.throwCoin(coin)
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
