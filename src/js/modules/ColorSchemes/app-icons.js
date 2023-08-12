/** @type {import('./types')} */

import { head } from '../../utils/Document'
import { groupElementsByColorScheme } from './media-attribute'

/** @type {NodeListOf<HTMLLinkElement>} App icons with a `prefers-color-scheme` media attribute. */
export const $appIcons = head.querySelectorAll('link[rel*="icon"][media]')
export const appIcons = groupElementsByColorScheme(Array.from($appIcons))

let previousScheme = null

/**
 * Push app icons at end of `<head>`: it tells the browser to pick among them.
 *
 * @param {AppColorScheme} colorScheme
 */
export const setFavicons = colorScheme => {
  if (colorScheme == previousScheme) { return }

  appIcons[colorScheme].forEach(icon => {
    icon.remove()
    head.insertAdjacentElement('beforeEnd', icon)
  })

  previousScheme = colorScheme
}
