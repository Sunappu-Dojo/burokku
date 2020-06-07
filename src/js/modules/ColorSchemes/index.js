const DEFAULT_THEME = 'dark';
const THEME_MQ = `(prefers-color-scheme: ${DEFAULT_THEME})`;

export default class ColorScheme {
  constructor() {
    this.MQ = matchMedia(THEME_MQ)

    this.themeColor = document.head.querySelector('meta[name="theme-color"]')

    this.MQ.addListener(e => {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()
      this.themeColor.setAttribute('content', color)
    })
  }
}
