export const doc = document.documentElement
export const head = document.head

// https://github.com/meduzen/setAttributes
export const setAttributes = (el, attrs) => {
  Object.entries(attrs).forEach(([name, value]) => {
    if (value == null) { return el.removeAttribute(name) }
    el.setAttribute(name, value)
  })
}
