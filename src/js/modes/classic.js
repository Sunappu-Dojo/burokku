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
    this.updateTitle()
  }

  onSpace(e) {
    this.app.blocks.active.onSpace(e)
  }

  onEnter(e) {
    this.app.blocks.active.onEnter(e)
  }

  updateTitle() {
    if (this.app.wallet.isEnabled) {
      document.title = `x ${this.app.wallet.money} • ${this.app.blocks.active.btn.dataset.game}`
    }
  }
}
