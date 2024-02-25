import { doc } from '../../utils/Document'
import { idbGet, idbSet } from '../../utils/Storage'
import { rAF } from '../../utils/Window'
import { blocks } from '../BlocksManager'
import ModeSelector from '../ModeSelector'

const menuToggleVisible = 'menu-toggle-visible'
const menuToggleAppears = 'menu__toggle--appears'

const COINS_REQUIRED = 5
const IDB_MENU_ALREADY_INTERACTED = 'menu-already-interacted'

let neverInteracted = false
const shouldPlayMenuIconAppearAnimation = coins => coins < 150 && neverInteracted

const $btn = document.getElementById('menu-toggle-btn')
const $menu = document.getElementById('?')

class Menu {
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
      this.#focusMenu()
      $menu.scrollTo(0, 0) // reset menu scroll to top
    }

    this.#isOpen = isOpen
    doc.classList.toggle('menu-visible', isOpen)
    $btn.setAttribute('aria-expanded', isOpen)
    $btn.classList.remove(menuToggleAppears)

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
      $btn.classList.toggle(menuToggleAppears, shouldPlayMenuIconAppearAnimation(coins))
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

  #focusMenu() {
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
     */
    if (!this.open) {
      function focus(e) {
        if (e.propertyName == 'visibility') {
          document.removeEventListener('transitionstart', focus)

          // Workaround: Safari sometimes fail to focus on `transitionstart`.
          rAF(() => rAF(() => ModeSelector.focus()))
        }
      }

      document.addEventListener('transitionstart', focus)
    }
  }

  onTap(e, stop) {
    const eventPath = e.composedPath()

    // toggle button
    if (eventPath.includes($btn)) {
      return this.toggle()
    }

    /**
     * @todo: add condition: if Pomodoro runs, don’t close it on block hit.
     */

    // tap outside of the menu
    if (!eventPath.includes($menu) && this.open) {
      this.close()
      stop()
    }
  }

  onEscape = this.toggle
  onWalletDisplayReady = this.initToggle
  onWalletBalanceUpdate = this.initToggle
}

/** @type {Menu} */
export let menu

export const initMenu = () => menu ??= new Menu()
