import { clamp }          from '../../utils/Math'
import { idbGet, idbSet } from '../../utils/Storage'
import CSS from './config'

const ctn = document.getElementById(CSS.ctn)
const blocks = ctn.getElementsByClassName(CSS.block)

// Navigation arrows
const $nav = document.getElementById(CSS.nav)
const prevBtn = $nav.querySelector(`.${CSS.prev}`)
const nextBtn = $nav.querySelector(`.${CSS.next}`)

function updateArrows() {
  prevBtn.toggleAttribute('disabled', currentIndex == 0)
  nextBtn.toggleAttribute('disabled', currentIndex == blocks.length - 1)
}

let currentIndex = 0

/**
 * Go from a block to another.
 * When navigating to another block, a `blockChange` event is fired.
 *
 * - .prev() : navigate to previous block
 * - .next() : navigate to next block
 * - .tap(navigationButtonElement) : trigger a click on a navigation arrow
 * - .onTap(clickEvent) : handle navigation on navigation button click
 * - .current : index of current block
 */
class Nav {
  constructor(maxPosition) {
    this.loadPosition(maxPosition).then(position =>
      this.current = position
    )
  }

  get current() {
    return currentIndex
  }

  set current(index) {
    currentIndex = index
    ctn.style.setProperty('--current', index)
    updateArrows()

    document.dispatchEvent(new CustomEvent('blockChange', {
      detail: index,
      isEdge: prevBtn.disabled || nextBtn.disabled, // @todo: why this prop?
    }))

    this.savePosition(index)
  }

  prev() { this.tap(prevBtn) }
  next() { this.tap(nextBtn) }

  last() {
    this.current = blocks.length - 1
  }

  tap(arrow) {
    if (!arrow.disabled) {
      this.current += parseInt(arrow.dataset.dir)
    }
  }

  onOneUp() {
    updateArrows()
    setTimeout(() => this.last(), 600)
  }

  onTap({ target }) {
    if (target.closest(`.${CSS.btn}`)) {
      this.tap(target)
    }
  }

  onTab(e) {
    const adjacentEl =
      e.shiftKey
        ? e.target.previousElementSibling
        : e.target.nextElementSibling

    if (!adjacentEl?.classList.contains('block')) { return }

    e.preventDefault()

    return e.shiftKey ? this.prev() : this.next()
  }

  update = updateArrows

  /**
   * Save position
   */
  savePosition(position) {
    idbSet('current-block', position)
  }

  /**
   * Load position
   */
  async loadPosition(maxPosition = 0) {
    // It might be useful to clamp during dev.
    return clamp(await idbGet('current-block', maxPosition), 0, maxPosition)
  }
}

/** @type {Nav} */
export let nav

export const initNav = (maxPosition = 0) => nav ??= new Nav(maxPosition)
