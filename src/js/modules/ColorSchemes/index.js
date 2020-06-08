const DEFAULT_THEME = 'light';
const THEME_MQ = `(prefers-color-scheme: ${DEFAULT_THEME})`;

const head = document.head

export default class ColorScheme {
  constructor() {
    this.MQ = matchMedia(THEME_MQ)

    this.MQ.addListener(e => {
      this.setThemeColor()
    })

    this.themeColor = head.querySelector('meta[name="theme-color"]')

    head.querySelectorAll('link[rel*="icon"][media]').forEach(linkEl => {
      matchMedia(linkEl.media).addListener(e => {
        if (e.matches) { this.setFavicon(linkEl) }
      })

      if (matchMedia(linkEl.media).matches) { this.setFavicon(linkEl) }
    })

    this.setThemeColor()
  }

  setFavicon(linkEl) {
    linkEl.remove()
    head.insertAdjacentElement('beforeEnd', linkEl)
  }

  setThemeColor() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    this.themeColor.setAttribute('content', color)
  }
}
