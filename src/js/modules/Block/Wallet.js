import { get as idbGet, set as idbSet } from 'idb-keyval'
import Sfx from '../../helpers/Sfx/index'

import { SOUNDS, CSS } from './config'

export default class Wallet {

  /**
   * Constructor
   */
  constructor() {
    this.makeSounds()

    this.scoreBoardReady = false
    this.coins = 0

    this.fromBank().then(money => {
      if (Number.isInteger(money)) {
        this.coins = money
        this.display()
      }
    })
  }

  /**
   * Please capitalism.
   */
  add(coins = 1) {
    this.coins++
    this.toBank(this.coins) // save coins

    Sfx.play(this.coin, .1)

    if (this.coins % 100 === 0) {
      Sfx.play(this.oneUp, .2) // 1-UP 🍄
    }

    this.display()
    this.makeSounds()
  }

  /**
   * Show coins amount
   */
  display() {
    this.prepareDisplay()
    this.output.innerHTML = this.coins
    this.pageTitle.innerHTML = 'x ' + this.coins
  }

  /**
   * Prepare money count display
   */
  prepareDisplay() {
    if (this.scoreBoardReady) { return }

    this.output = document.getElementById(CSS.coinsNumber)
    this.pageTitle = document.head.querySelector('title')

    document.dispatchEvent(new CustomEvent('firstWalletDisplay'))

    document.getElementById('wallet').classList.add('wallet--on')
    this.scoreBoardReady = true
  }

  /**
   * Save money
   */
  toBank(value) {
    if ('indexedDB' in window) {
      idbSet('coins-amount', value)
    }
  }

  /**
   * Load money
   */
  async fromBank() {
    if (!('indexedDB') in window) { return 0 }

    return idbGet('coins-amount')
  }

  makeSounds() {
    this.coin = Sfx.makeFrom(SOUNDS.coin)
    this.oneUp = Sfx.makeFrom(SOUNDS.oneUp)
  }
}
