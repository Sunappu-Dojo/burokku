import app from '../App'
import { wallet } from '../modules'

export default class Classic {
  // name = 'classic'

  init() {
    wallet.enable()
  }

  destroy() {
    wallet.disable()
  }

  onCoinThrow(coins) {
    wallet.onCoinThrow(coins)
    app.updateTitle()
  }

  onSpace(e) {
    app.blocks.active.onSpace(e)
  }

  onEnter(e) {
    app.blocks.active.onEnter(e)
  }

  getTitle() {
    if (wallet.isEnabled) {
      return `× ${wallet.money} • ${app.blocks.active.btn.dataset.game}`
    }
  }
}
