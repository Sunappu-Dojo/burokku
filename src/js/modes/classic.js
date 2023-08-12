import { wallet } from '../modules'

export default class Classic {
  // name = 'classic'

  constructor(app) {
    this.app = app
  }

  init() {
    wallet.enable()
  }

  destroy() {
    wallet.disable()
  }

  onCoinThrow(coins) {
    wallet.onCoinThrow(coins)
    this.app.updateTitle()
  }

  onSpace(e) {
    this.app.blocks.active.onSpace(e)
  }

  onEnter(e) {
    this.app.blocks.active.onEnter(e)
  }

  getTitle() {
    if (wallet.isEnabled) {
      return `× ${wallet.money} • ${this.app.blocks.active.btn.dataset.game}`
    }
  }
}
