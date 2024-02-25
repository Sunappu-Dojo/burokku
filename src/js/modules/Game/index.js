import { Classic, Pomodoro } from '../../modes'
import { ModeSelector } from '..'

const modes = {
  classic: Classic,
  pomodoro: Pomodoro,
}

class Game {
  #game

  constructor() {
    if (!this.game) {
      this.initGame()
    }
  }

  updateTitle() {
    document.title = this.game.getTitle()
  }

  initGame() {
    this.game?.destroy()
    this.game = new modes[ModeSelector.selected](this)
    this.game.init()
  }

  onBlockChange(e) {
    this.game?.onBlockChange?.()
    this.updateTitle()
  }

  onCoinThrow(e) {
    this.game?.onCoinThrow(e.detail)
  }

  onSpace(e) {
    this.game.onSpace?.(e)
  }

  onEnter(e) {
    this.game.onEnter?.(e)
  }
}

/** @type {Game} */
export let game

export const initGame = () => game ??= new Game()
