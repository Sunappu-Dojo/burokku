import { blocks, game, wallet } from '../modules'

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
    game.updateTitle()
  }

  onSpace(e) {
    blocks.active.onSpace(e)
  }

  onEnter(e) {
    blocks.active.onEnter(e)
  }

  getTitle() {
    if (wallet.enabled) {
      return `× ${wallet.coins} • ${blocks.active.game}`
    }
  }
}
