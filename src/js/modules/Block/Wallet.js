import { get as idbGet, set as idbSet } from 'idb-keyval'
import Sfx from '../../helpers/Sfx/index'

import { SOUNDS, CSS } from './config'

export default class Wallet {

  get coins() {
    return this.money
  }

  set coins(value) {
    this.money = value
    this.toBank(value)
  }

  /**
   * Constructor
   */
  constructor() {
    this.makeSounds(true)

    this.fromBank().then(money => {
      this.coins = money
      this.prepareDisplay()
      this.display()
    })
  }

  /**
   * Please capitalism.
   */
  add(coins = 1) {
    this.coins++

    this.playSounds()
    this.display()
  }

  /**
   * Show coins amount
   */
  display() {
    this.output.innerHTML = this.coins
    this.pageTitle.innerHTML = `x ${this.coins} • Sunappu ⍰`
  }

  /**
   * Prepare money count display
   */
  prepareDisplay() {
    this.output = document.getElementById(CSS.coinsNumber)
    this.pageTitle = document.head.querySelector('title')

    document.getElementById('wallet').classList.add('wallet--on')

    document.dispatchEvent(new CustomEvent('walletDisplayReady'))
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

    return await idbGet('coins-amount').then(money => Number.isInteger(money) ? money : 0)
  }

  // SFX

  playSounds() {
    Sfx.play(this.coin, .1)

    const isOneUp = this.coins % 100 === 0
    if (isOneUp) {
      Sfx.play(this.oneUp, .2) // 1-UP 🍄
    }

    this.makeSounds(isOneUp)
  }

  makeSounds(isOneUp = null) {
    this.coin = Sfx.makeFrom(SOUNDS.coin)

    if (isOneUp) {
      this.oneUp = Sfx.makeFrom(SOUNDS.oneUp)
    }
  }
}
