import CSS from './config'

const ctn = document.getElementById(CSS.ctn)
const blocksNb = document.getElementsByClassName(CSS.block).length

// Navigation arrows
const nav = document.getElementById(CSS.nav)
const prevBtn = nav.querySelector(`.${CSS.prev}`)
const nextBtn = nav.querySelector(`.${CSS.next}`)

function updateArrows() {
  prevBtn.toggleAttribute('disabled', currentIndex == 0)
  nextBtn.toggleAttribute('disabled', currentIndex == blocksNb - 1)
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
  }

  constructor() {
    this.current = 0
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
}

export default function() {
  return new Nav()
}
