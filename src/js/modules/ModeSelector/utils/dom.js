import { CSS } from '../config'

/**
 * Get mode buttons.
 *
 * @type {Record<Mode, HTMLButtonElement>}
 */
export const btns = Object.fromEntries(
  [...document.getElementsByClassName(CSS.btn)].map(btn => ([btn.dataset.mode, btn]))
)

/**
 * Mark mode button as selected or unselected.
 *
 * @param {Mode} mode
 * @param {boolean} [selected=undefined]
 */
export const toggleBtn = (mode, selected = undefined) => {
  // btns[mode].disabled = selected
  btns[mode].classList.toggle('cta--hollow', selected)
  btns[mode].classList.toggle('cta--on-hover', !selected)
}
