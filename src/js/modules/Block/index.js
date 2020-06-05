import Sfx from '../../helpers/Sfx/index'
import Wallet from './Wallet'

import { SOUNDS, CSS } from './config'

export default class Block {
  get animating() {
    return this.isAnimating
  }

  set animating(value) {
    this.isAnimating = value

    if (!value) {
      return this.btn.classList.remove(CSS.hit)
    }

    this.btn.classList.add(CSS.hit)
    Sfx.play(this.bump)
    this.makeSounds()
  }

  constructor() {
    this.btn = document.getElementsByClassName(CSS.btn)[0]
    this.animating = false
    this.wallet = new Wallet()

    this.makeSounds()
  }

  onTap({ target }) {
    if (target !== this.btn || this.animating) { return }

    this.animating = true
    this.wallet.add(1)
  }

  onAnimationEnd({ animationName }) {
    if (animationName === CSS.hitAnimation) {
      this.animating = false
    }
  }

  makeSounds() {
    this.bump = Sfx.makeFrom(SOUNDS.bump)
  }
}
