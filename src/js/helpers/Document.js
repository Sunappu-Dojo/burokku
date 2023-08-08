export const doc = document.documentElement
export const head = document.head

/**
 * Bulk assign attributes. To remove an attribute, pass `null` or `undefined`.
 * https://github.com/meduzen/setAttributes
 *
 * @param {HTMLElement} el
 * @param {Record<string, any>} attrs
 */
export const setAttributes = (el, attrs) => {
  Object.entries(attrs).forEach(([name, value]) => {
    if (value == null) {
      return el.removeAttribute(name)
    }
    el.setAttribute(name, value)
  })
}
