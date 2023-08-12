export const doc = document.documentElement
export const head = document.head

/**
 * Bulk assign attributes. To remove an attribute, pass `null` or `undefined`.
 * https://github.com/meduzen/setAttributes
 *
 * @param {HTMLElement} element
 * @param {Record<string, any>} attrs
 */
export const setAttributes = (element, attrs) => {
  Object.entries(attrs).forEach(([name, value]) => {
    console.log(name, value)
    if (value == null) {
      return element.removeAttribute(name)
    }
    element.setAttribute(name, value)
  })
}
