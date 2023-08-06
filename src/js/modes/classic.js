export default class Classic {
  // name = 'classic'

  constructor(app) {
    this.app = app
  }

  init() {
    this.app.wallet.enable()
  }

  destroy() {
    this.app.wallet.disable()
  }

  onCoinThrow(coins) {
    this.app.wallet.onCoinThrow(coins)
    this.app.updateTitle()
  }

  onSpace(e) {
    this.app.blocks.active.onSpace(e)
  }

  onEnter(e) {
    this.app.blocks.active.onEnter(e)
  }

  getTitle() {
    if (this.app.wallet.isEnabled) {
      return `× ${this.app.wallet.money} • ${this.app.blocks.active.btn.dataset.game}`
    }
  }
}
