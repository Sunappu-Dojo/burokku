import { doc } from '../../helpers/Document'
import ModeSelector from '../ModeSelector'

const menuToggleVisible = 'menu__toggle--visible'

const COINS_REQUIRED = 5

class Menu {
  #$btn = document.getElementById('menu-toggle-btn')
  #$menu = document.getElementById('?')
  #isOpen = false
  #ready = false

  get open() {
    return this.#isOpen
  }

  /**
   * @todo: Use `inert` as focus trap (still awaiting for browser support).
   */
  set open(isOpen) {
    this.#isOpen = isOpen
    doc.classList.toggle('menu-visible', isOpen)
  }

  initToggle(coins = 0) {
    if (this.#ready) { return }

    if (coins >= COINS_REQUIRED) {
      this.#$btn.classList.add(menuToggleVisible)
      this.#ready = true
    }
  }

  toggle(shouldOpen = !this.open) {
    this.open = shouldOpen
  }

  close() {
    this.toggle(false)
  }

  onTap(e) {
    const eventPath = e.composedPath()

    // toggle button
    if (eventPath.includes(this.#$btn)) {
      return this.toggle()
    }

    /**
     * @todo: add condition: if Pomodoro runs, don’t close it on block hit.
     */
    // outside of the menu
    if (!eventPath.includes(this.#$menu) && this.open) {
      this.close()
    }
  }

  onEscape() {
    /**
     * Move the focus to the menu when the Escape key opens it. Due to a
     * CSS transition on `visibility`, it can’t immediately be moved.
     * To do so as early as possible independently of the duration
     * of the transition, we listen to `transitionstart`. As it
     * fires once for each transitioned property, the `once`
     * event listener option can not automatically remove
     * the listener once the event is consumed, that’s
     * why we remove it in the handler, after focus.
     * Even `prefers-reduce-motion` is handled as
     * it gets a 0.001s `transition-duration`.
     * `rAF` is for Safari, which sometimes
     *  can’t focus on transition start.
     */
    if (!this.open) {
      function focus(e) {
        if (e.propertyName == 'visibility') {
          document.removeEventListener('transitionstart', focus)

          requestAnimationFrame(() => requestAnimationFrame(() => {
            ModeSelector.focus()
          }))
        }
      }

      document.addEventListener('transitionstart', focus)
    }

    this.toggle()
  }

  onWalletDisplayReady = this.initToggle
  onWalletBalanceUpdate = this.initToggle
}

export default function() {
  return new Menu()
}
