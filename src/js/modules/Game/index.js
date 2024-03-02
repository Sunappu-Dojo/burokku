import { Classic } from '../../modes'

const modes = {
  classic: Classic,
}

class Game {
  #game

  get game() {
    return this.#game
  }

  get status() {
    return this.#game.status
  }

  constructor() {
    if (!this.#game) {
      this.initGame()
    }
  }

  initGame() {
    this.#game?.destroy()
    this.#game = new modes.classic()
    this.#game.init()
  }

  updateTitle() {
    document.title = this.#game.getTitle()
  }

  onBlockChange(e) {
    this.#game?.onBlockChange?.()
    this.updateTitle()
  }

  onCoinThrow(e) {
    this.#game?.onCoinThrow(e.detail)
  }

  onSpace(e) {
    this.#game.onSpace?.(e)
  }

  onEnter(e) {
    this.#game.onEnter?.(e)
  }
}

/** @type {Game} */
export let game

export const initGame = () => game ??= new Game()
