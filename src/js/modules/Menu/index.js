import { doc } from '../../helpers/Document'
import { idbGet, idbSet } from '../../helpers/Storage'
import { rAF } from '../../helpers/Window'
import { blocks } from '../BlocksManager'
import ModeSelector from '../ModeSelector'

const menuToggleVisible = 'menu-toggle-visible'
const menuToggleAppears = 'menu__toggle--appears'

const COINS_REQUIRED = 5
const IDB_MENU_ALREADY_INTERACTED = 'menu-already-interacted'

let neverInteracted = false
const shouldPlayMenuIconAppearAnimation = coins => coins < 150 && neverInteracted

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
    if (neverInteracted) {
      idbSet(IDB_MENU_ALREADY_INTERACTED, true)
    }

    if (isOpen) {
      this.focusMenu()
      this.#$menu.scrollTo(0, 0) // reset scroll to top
    }

    this.#isOpen = isOpen
    doc.classList.toggle('menu-visible', isOpen)
    this.#$btn.setAttribute('aria-expanded', isOpen)
    this.#$btn.classList.remove(menuToggleAppears)

    // Focus active block
    if (!isOpen) {
      blocks.active.focus()
    }
  }

  initToggle(coins = 0) {
    if (coins < COINS_REQUIRED || this.#ready) { return }

    // Delay menu appearance: sometimes layout is not fully ready.
    setTimeout(async () => {
      neverInteracted = !(await idbGet(IDB_MENU_ALREADY_INTERACTED, false))

      doc.classList.add(menuToggleVisible)
      this.#$btn.classList.toggle(menuToggleAppears, shouldPlayMenuIconAppearAnimation(coins))
    }, 200)

    this.#ready = true
  }

  toggle(shouldOpen = !this.open) {
    if (!this.#ready) { return }

    this.open = shouldOpen
    document.dispatchEvent(new CustomEvent('menuVisibility', { detail: shouldOpen }))
  }

  close() {
    this.toggle(false)
  }

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

    /**
     * @todo: add condition: if Pomodoro runs, don’t close it on block hit.
     */
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

export let menu

export const initMenu = () => menu = new Menu()
