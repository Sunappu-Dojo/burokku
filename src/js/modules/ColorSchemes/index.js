/** @type {import('./types')} */

import { doc, setAttributes }             from '../../helpers/Document'
import { idbDel, idbGet, idbSet }         from '../../helpers/Storage'

import { setFavicons }                    from './app-icons'
import { setMetaThemeColor, themeColors } from './meta-theme-color'
import { CSS, cssThemeSet }               from './styles'

const $btn = document.getElementById('color-scheme-toggle')
const $name = document.getElementById('color-scheme-current-label')
const $nameLiveRegion = document.getElementById('color-scheme-status')

const IDB_COLOR_SCHEME = 'color-scheme'

const colorSchemeNames = {
  dark: 'Basic Black',
  light: 'Basic White',
}

const getColorSchemeName = (scheme, applied) => colorSchemeNames[scheme] ?? `<strong>Auto</strong> (${colorSchemeNames[applied]})`

class ColorSchemes {

  /** @type {SystemColorScheme} */
  #current = 'auto'

  #mediaQueries = {}

  /** @type {SystemColorScheme[]} */
  get #order() {
    return this.#mediaQueries.dark.matches
      ? ['dark', 'light', 'auto']
      : ['light', 'dark', 'auto']
  }

  get #applied() {
    return this.#current != 'auto'
      ? this.#current
      : this.#mediaQueries.dark.matches ? 'dark' : 'light'
  }

  get #next() {
    let nextIndex = this.#order.indexOf(this.#current) - 1

    return this.#order[nextIndex] ?? 'auto'
  }

  /**
   * Prepare UI (app icons, theme-color) and watch color scheme change.
   */
  constructor(app) {
    this.app = app

    Object.entries(themeColors)
      .map(([schemeName, elems]) => ({
        schemeName,
        schemeMQ: matchMedia(elems[0].media),
      }))
      .forEach(({ schemeName, schemeMQ }) => {
        this.#mediaQueries[schemeName] = schemeMQ

        if (schemeMQ.matches) {
          this.updateName()
        }

        // Fire `colorSchemeChange` event.

        schemeMQ.addListener(e => {
          if (!e.matches || this.#current != 'auto') { return }

          this.set('auto')

          document.dispatchEvent(new CustomEvent('colorSchemeChange', {
            detail: schemeName, // 'dark' or 'light'
          }))
        })
      })

    idbGet(IDB_COLOR_SCHEME, 'auto').then(scheme => this.set(scheme))
  }

  /**
   * Set color scheme.
   *
   * @param {SystemColorScheme} newScheme
   */
  set(newScheme = 'auto') {
    doc.classList.remove(cssThemeSet, CSS[this.#applied])

    const previousScheme = this.#current
    this.#current = newScheme

    setFavicons(this.#applied)
    setMetaThemeColor(newScheme, previousScheme)

    if (newScheme != 'auto') {
      doc.classList.add(cssThemeSet, CSS[this.#applied])
    }

    this.updateName()
  }

  updateName() {
    $name.innerHTML = getColorSchemeName(this.#current, this.#applied)
    this.ariaAnnounce()
  }

  /**
   * We remove `role=status` when the menu is closed, otherwise the current
   * color scheme is announced as soon as the menu is open again. But we
   * only want to re-add it on theme selection when the menu is open.
   */
  ariaAnnounce() {
    setAttributes($nameLiveRegion, {
      role: this.app.menu.open ? 'status' : null
    })
  }

  onTap(e) {
    if (e.target != $btn) { return }

    if (this.#next == 'auto') {
      idbDel(IDB_COLOR_SCHEME)
    } else {
      idbSet(IDB_COLOR_SCHEME, this.#next)
    }

    this.set(this.#next)
  }

  onMenuVisibilityChange(e) {

    // remove `role=status` when menu is closed
    if (!e.detail) {
      this.ariaAnnounce()
    }
  }

  // onColorSchemeChange(e) {
  //   this.set(e.detail)
  // }
}

export default function(app) {
  return new ColorSchemes(app)
}
