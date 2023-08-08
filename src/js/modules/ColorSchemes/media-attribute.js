/** @type {import('./types')} */

/**
 * Create a list (array) of unique MediaQueryList.
 * @param {(HTMLLinkOrMetaElement)[]} elems
 */
export const getMediaQueryFrom = elems => Array.from(new Set(elems.map(el => el.media)), matchMedia)

/**
 * Extract color scheme name from media query
 * Example: '(prefers-color-scheme: light)' returns 'light'.
 *
 * @param {MediaQueryListEvent.media} media
 * @returns {'dark'|'light'}
 */
export const getSchemeName = media => media.match(/\([a-z\-]{20}: ([a-z]+)\)/)?.at(1)

/**
 * Gather elements by color scheme.
 *
 * @param {(HTMLLinkOrMetaElement)[]} elems
 * @returns {ColorSchemesItems}
 */
export const groupElementsByColorScheme = elems => elems.reduce((groups, elem) => {
  const scheme = getSchemeName(elem.media);

  (groups[scheme] ??= []).push(elem)

  return groups
}, {})
