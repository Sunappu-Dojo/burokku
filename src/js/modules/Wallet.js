import { setAttributes }  from '../utils/Document'
import { clamp }          from '../utils/Math'
import Rumble             from '../utils/Rumble'
import Sfx                from '../utils/Sfx'
import { idbGet, idbSet } from '../utils/Storage'

import { SOUNDS } from './Block/config'

// Those kind of limits exist in videogames, right?
const MAX_COINS = 999_999
const IDB_COINS = 'coins-amount'

class Wallet {
  #enabled = false
  #money = 0

  #sfx = {
    coin: null,
    oneUp: null,
  }

  #$output = document.getElementById('coins')
  #$coinIcon = document.getElementById('wallet-coin')
  #$coinIconPath = document.getElementById('wallet-coin-use')

  constructor() {
    this.makeSounds(true)

    this.fromBank().then(money => {
      this.coins = money
      this.prepareDisplay()
      this.display()
    })
  }

  get coins() {
    return this.#money
  }

  set coins(value) {
    this.#money = value
    this.toBank(value)
    document.dispatchEvent(new CustomEvent('walletBalanceUpdate', { detail: value }))
  }

  get enabled() { return this.#enabled }

  enable() {
    this.#enabled = true
  }

  disable() {
    this.#enabled = false
  }

  /**
   * Please capitalism.
   */
  add(coins = 1) {
    if (!this.#enabled) { return }

    this.coins += coins

    this.playSounds()
    this.display()
  }

  onCoinThrow(coins) {
    if (!this.#enabled) { return }

    this.add(coins)
  }

  onOneUp() {
    /**
     * Delay the vibration a bit, otherwise it may not start because the
     * vibration following the block bump is already running.
     */
    setTimeout(() => Rumble.vibrate([120, 0, 120, 0, 120]), 180)
  }

  /**
   * Show coins amount
   */
  display() {
    this.#$output.textContent = this.coins
  }

  /**
   * Prepare money count display
   */
  prepareDisplay() {
    document.getElementById('wallet').classList.add('wallet--on')

    document.dispatchEvent(new CustomEvent('walletDisplayReady', { detail: this.coins }))
  }

  /**
   * Save money
   */
  toBank = value => idbSet(IDB_COINS, value)

  /**
   * Load money
   */
  fromBank = async () => clamp(await idbGet(IDB_COINS, 0), 0, MAX_COINS)

  // SFX

  playSounds() {
    Sfx.play(this.#sfx.coin, .1)

    const isOneUp = this.coins % 100 === 0
    if (isOneUp) {
      Sfx.play(this.#sfx.oneUp, .2) // 1-UP 🍄
      document.dispatchEvent(new CustomEvent('oneUp'))
    }

    this.makeSounds(isOneUp)
  }

  makeSounds(isOneUp = false) {
    this.#sfx.coin = Sfx.makeFrom(SOUNDS.coin)

    if (isOneUp) {
      this.#sfx.oneUp = Sfx.makeFrom(SOUNDS.oneUp)
    }
  }

  onBlockChange({ id, coinSize }) {
    this.makeSounds(true)

    // Update coin path and dimensions

    this.#$coinIconPath.setAttribute('xlink:href', `#coin-${id}-path`)

    setAttributes(this.#$coinIcon, coinSize)
  }
}

/** @type {Wallet} */
export let wallet

export const initWallet = app => wallet ??= new Wallet(app)
