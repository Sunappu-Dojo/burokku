import { doc } from '../../helpers/Document'
import { rAF } from '../../helpers/Window'
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
    if (isOpen) {
      this.focusMenu()
      this.#$menu.scrollTo(0, 0) // reset scroll to top
    }

    this.#isOpen = isOpen
    doc.classList.toggle('menu-visible', isOpen)
    this.#$btn.setAttribute('aria-expanded', isOpen)

    // Focus active block
    if (!isOpen) {
      this.app.blocks.active.focus()
    }
  }

  constructor(app) {
    this.app = app
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
    document.dispatchEvent(new CustomEvent('menuVisibility', { detail: shouldOpen }))
  }

  close() {
    this.toggle(false)
  }

    /**
     * @todo: add condition: if Pomodoro runs, don’t close it on block hit.
     */
  focusMenu() {
    /**
     * Move the focus to the mode selector when the menu opens. Due to a
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

          rAF(() => rAF(() => ModeSelector.focus()))
        }
      }

      document.addEventListener('transitionstart', focus)
    }
  }

  onTap(e, stop) {
    const eventPath = e.composedPath()

    // toggle button
    if (eventPath.includes(this.#$btn)) {
      return this.toggle()
    }

    // outside of the menu
    if (!eventPath.includes(this.#$menu) && this.open) {
      this.close()
      stop()
    }
  }

  onEscape = this.toggle
  onWalletDisplayReady = this.initToggle
  onWalletBalanceUpdate = this.initToggle
}

export default function(app) {
  return new Menu(app)
}
