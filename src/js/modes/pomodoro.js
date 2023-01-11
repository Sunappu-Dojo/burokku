const $timeLeft = document.getElementById('time-left')

/**
 * The real duration between countdown ticks in the games, in milliseconds.
 */
const MARIO_SECOND = {
  smb: 400,
  smb3: 1000,
  smw: 700,
}

export default class Pomodoro {
  #timer = null
  #bumpTimer = null
  #time = 0
  #interval = 1000
  #status = 'stopped'

  constructor(app) {
    this.app = app
  }

  init() {
    this.reset()
  }

  start() {
    this.reset()
    this.#timer = setInterval(this.tick.bind(this), this.#interval)
    this.#bumpTimer = setInterval(this.bump.bind(this), MARIO_SECOND.smb)
    this.#status = 'playing'
    this.display()
  }

  pause() {

  }

  stop() {
    this.reset()
  }

  reset() {
    clearInterval(this.#timer)
    clearInterval(this.#bumpTimer)
    this.#timer = null
    this.#bumpTimer = null
    this.#time = 10
    this.#status = 'stopped'
  }

  bump() {
    if (this.#status == 'playing') {
      this.app.blocks.active.btn.dispatchEvent(new Event('click'))
    }
  }

  tick() {
    if (this.#status != 'playing') { return }

    this.#time--
    this.display()

    if (this.#time == 0) {
      this.reset()
    }
  }

  /**
   * Show time left
   */
  display() {
    $timeLeft.innerHTML = this.#time
    this.updateTitle()
  }

  toggle() {

  }

  destroy() {
    this.stop()
  }

  onCoinThrow() {
    switch (this.#status) {
      case 'stopped':
        this.start()
        break

      case 'playing':
        this.#status = 'paused'
        break

      case 'paused':
        this.#status = 'playing'
        break
    }
  }

  updateTitle() {
    document.title = `${this.#time.toString().padStart(3, 0)} • ${this.app.blocks.active.btn.dataset.game}`
  }
}
