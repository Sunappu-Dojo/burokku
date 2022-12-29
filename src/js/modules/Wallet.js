import { setAttributes }  from '../helpers/Document'
import { clamp }          from '../helpers/Math'
import Rumble             from '../helpers/Rumble'
import Sfx                from '../helpers/Sfx'
// import { idbGet, idbSet } from '../helpers/Storage'
import { idbGet, idbSet } from '../helpers/Storage/idbLegacy'

import { SOUNDS } from './Block/config'

// Those kind of limits exist in videogames, right?
const MAX_COINS = 999_999

class Wallet {

  constructor() {
    this.makeSounds(true)

    this.fromBank().then(money => {
      this.coins = money
      this.prepareDisplay()
      this.display()
    })
  }

  get coins() {
    return this.money
  }

  set coins(value) {
    this.money = value
    this.toBank(value)
  }

  /**
   * Please capitalism.
   */
  add(coins = 1) {
    this.coins += coins

    this.playSounds()
    this.display()
  }

  onCoinThrow(coins) {
    this.add(coins)
  }

  onOneUp() {
    /**
     * Delay the vibration a bit, otherwise it may not start because the
     * vibration following the block bump is already running.
     *
     *
     */
    setTimeout(() => Rumble.vibrate([120, 0, 120, 0, 120]), 180)
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
    idbSet('coins-amount', value)
  }

  /**
   * Load money
   */
  async fromBank() {
    return clamp(await idbGet('coins-amount', 0), 0, MAX_COINS)
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
      width: { value: width },
      height: { value: height },
    } = coins[0].querySelector('svg').attributes

    this.coinIconPath.setAttribute('xlink:href', `#coin-${id}-path`)

    setAttributes(this.coinIcon, { width, height })
  }
}

export default function() {
  return new Wallet()
}
