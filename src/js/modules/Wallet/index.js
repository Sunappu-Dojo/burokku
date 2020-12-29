import { get as idbGet, set as idbSet } from 'idb-keyval'
import Sfx from '../../helpers/Sfx/index'
import { setAttributes }  from '../../helpers/Dom'

import { SOUNDS } from '../Block/config'

class Wallet {

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

  onCoinThrow(coins) {
    this.add(coins)
  }

  /**
   * Show coins amount
   */
  display() {
    this.output.innerHTML = this.coins
  }

  /**
   * Prepare money count display
   */
  prepareDisplay() {
    this.output = document.getElementById('coins')
    this.coinIcon = document.getElementById('wallet-coin')
    this.coinIconPath = document.getElementById('wallet-coin-use')

    document.getElementById('wallet').classList.add('wallet--on')

    document.dispatchEvent(new CustomEvent('walletDisplayReady', { detail: this.coins }))
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
  fromBank() {
    return ('indexedDB' in window)
      ? idbGet('coins-amount').then(money => Number.isInteger(money) ? money : 0)
      : 0
  }

  // SFX

  playSounds() {
    Sfx.play(this.coin, .1)

    const isOneUp = this.coins % 100 === 0
    if (isOneUp) {
      Sfx.play(this.oneUp, .2) // 1-UP 🍄
      document.dispatchEvent(new CustomEvent('oneUp'))
    }

    this.makeSounds(isOneUp)
  }

  makeSounds(isOneUp = false) {
    this.coin = Sfx.makeFrom(SOUNDS.coin)

    if (isOneUp) {
      this.oneUp = Sfx.makeFrom(SOUNDS.oneUp)
    }
  }

  onBlockChange({ btn: { id }, coins }) {
    this.makeSounds(true)

    // Update coin path and dimensions
    const {
      viewBox: { value: viewBox },
      width: { value: w },
      height: { value: h },
    } = coins[0].querySelector('svg').attributes

    this.coinIconPath.setAttribute('xlink:href', `#coin-${id}-path`)

    setAttributes(this.coinIcon, {
      viewBox,
      width: w,
      height: h,
    })
  }
}

export default function() {
  return new Wallet()
}
