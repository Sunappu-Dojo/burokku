const DEFAULT_THEME = 'light';
const THEME_MQ = `(prefers-color-scheme: ${DEFAULT_THEME})`;

export default class ColorScheme {
  constructor() {
    this.MQ = matchMedia(THEME_MQ)
    this.themeColor = document.head.querySelector('meta[name="theme-color"]')

    this.setThemeColor()

    this.MQ.addListener(e => {
      this.setThemeColor()
    })
  }

  setThemeColor() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
    this.themeColor.setAttribute('content', color)
  }
}
