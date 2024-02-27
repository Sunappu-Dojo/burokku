import './types'

import { doc } from '../../utils/Document'
import { CSS } from './config'
import {
  DEFAULT_MODE,
  route,
  isPomodoro,
  focusBtn,
  toggleBtn
} from './utils'

// Initialize default button

toggleBtn(DEFAULT_MODE, true)

export default class ModeSelector {
  static #mode = DEFAULT_MODE

  static get selected() {
    return this.#mode
  }

  static onTap(e) {
    if (e.target.classList.contains(CSS.btn)) {
      this.#select(e.target.dataset.mode)
    }
  }

  static setFromUrl() {
    this.#select(isPomodoro() ? 'pomodoro' : 'classic')
  }

  /**
   * Moves the focus to the mode selector.
   */
  static focus() {
    focusBtn(this.#mode)
  }

  /**
   * Select a mode.
   * @param {Mode} mode
   */
  static #select(mode) {
    if (this.#mode == mode || !route(mode)) { return }

    // Update buttons status
    toggleBtn(this.#mode, false)
    toggleBtn(mode, true)

    // Update states
    doc.classList.replace(`mode-${this.#mode}`, `mode-${mode}`)
    this.#mode = mode

    // Update history and dispatch `modechange` event.
    history.replaceState({}, '', route(mode))
    document.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }))
  }
}
