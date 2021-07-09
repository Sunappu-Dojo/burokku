const head = document.head

const themeColor = head.querySelector('meta[name="theme-color"]')

// All app icons with a prefers-color-scheme media query
const appIcons = Array.from(head.querySelectorAll('link[rel*="icon"][media]'))

// Icons, categorized by color schemes.
const groupedIcons = []

/**
 * Create a list (array) of unique MediaQueryList.
 */
const getColorSchemesMQFrom = elems => Array.from(new Set(elems.map(el => el.media)), matchMedia)

/**
 * Extract color scheme name from MQ
 *
 * Example: '(prefers-color-scheme: light)' returns 'light'.
 */
const getSchemeName = media => media
  .replace('(prefers-color-scheme: ', '')
  .replace(')', '')


/**
 * Push app icons at end of <head>, telling the browser to pick among them.
 */
const setFavicon = icons => icons.forEach(icon => {
  icon.remove()
  head.insertAdjacentElement('beforeEnd', icon)
})

/**
 * Update theme colors
 */
const setThemeColor = () => {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
  themeColor.setAttribute('content', color)
}

/**
 * Update UI, fire event.
 */
const onColorSchemeChange = e => {
  if (!e.matches) { return }

  setFavicon(groupedIcons[e.media])
  setThemeColor()

  document.dispatchEvent(new CustomEvent('colorSchemeChange', {
    detail: getSchemeName(e.media)
  }))
}

/**
 * Prepare UI and watch color scheme change.
 */
const watchColorSchemes = () => {
  getColorSchemesMQFrom(appIcons).forEach(schemeMQ => {

    // Gather icons by color scheme.
    groupedIcons[schemeMQ.media] = appIcons.filter(icon => icon.media == schemeMQ.media)

    // Listen to color scheme changes.
    schemeMQ.addListener(onColorSchemeChange)

    // Initialize theme color and favicons.
    setThemeColor()
    if (schemeMQ.matches) {
      setFavicon(groupedIcons[schemeMQ.media])
    }
  })
}

export default watchColorSchemes
