/** @type {import('./types')} */

import { head } from '../../helpers/Document'
import { groupElementsByColorScheme } from './media-attribute'

/** @type {NodeListOf<HTMLMetaElement>} `<meta>` with a `prefers-color-scheme` media attribute. */
const $themeColors = head.querySelectorAll('meta[name="theme-color"]')
export const themeColors = groupElementsByColorScheme(Array.from($themeColors))

/**
 * Manage `<meta name="theme-color">`, assuming all have a `media` attribute.
 *
 * @param {SystemColorScheme} newScheme
 * @param {SystemColorScheme} oldScheme
 *
 */
export const setMetaThemeColor = (newScheme, oldScheme) => {
  if (newScheme == oldScheme) { return }

  // Remove all `<meta name="theme-color">` elements.

  $themeColors.forEach($metaEl => $metaEl.remove())

  // When `auto`, reset DOM with initial `<meta name="theme-color">` elements.

  if (newScheme == 'auto') {
    return head.append(...$themeColors)
  }

  // Otherwise, add `<meta>` for selected scheme, without media `attribute`.

  const $metaEl = themeColors[newScheme][0].cloneNode()
  $metaEl.removeAttribute('media')
  head.appendChild($metaEl)
}
