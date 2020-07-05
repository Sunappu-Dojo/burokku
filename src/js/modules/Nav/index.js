import { get as idbGet, set as idbSet } from 'idb-keyval'
import CSS from './config'

const ctn = document.getElementById(CSS.ctn)
const blocks = ctn.getElementsByClassName(CSS.block)

// Navigation arrows
const nav = document.getElementById(CSS.nav)
const prevBtn = nav.querySelector(`.${CSS.prev}`)
const nextBtn = nav.querySelector(`.${CSS.next}`)

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

  get current() {
    return currentIndex
  }

  set current(index) {
    currentIndex = index
    ctn.style.setProperty('--current', index)
    updateArrows()

    document.dispatchEvent(new CustomEvent('blockChange', {
      detail: index,
      isEdge: prevBtn.disabled || nextBtn.disabled,
    }))

    this.savePosition(index)
  }

  constructor() {
    this.loadPosition().then(position => {
      this.current = position
    })
  }

  prev() { this.tap(prevBtn) }
  next() { this.tap(nextBtn) }

  tap(arrow) {
    if (arrow.disabled) { return }

    this.current += parseInt(arrow.dataset.dir)
  }

  onTap({ target }) {
    if (!target.closest(`.${CSS.btn}`)) { return }

    this.tap(target)
  }

  onTab(e) {
    const adjacentEl =
      e.shiftKey
        ? e.target.previousElementSibling
        : e.target.nextElementSibling

    if (!adjacentEl || !adjacentEl.classList.contains('block')) { return }

    e.preventDefault()

    return e.shiftKey ? this.prev() : this.next()
  }

  update() {
    updateArrows()
  }

  /**
   * Save position
   */
  savePosition(position) {
    if ('indexedDB' in window) {
      idbSet('current-block', position)
    }
  }

  /**
   * Load position
   */
  loadPosition() {
    return ('indexedDB' in window)
      ? idbGet('current-block').then(position => Number.isInteger(position) ? position : 0)
      : 0
  }
}

export default function() {
  return new Nav()
}
