import { captureEvent } from '../helpers/EventListenerOptions'
import { isFullscreen } from '../utils/MediaQueries'
import { initNav } from '../modules'
import { ModeSelector } from '../modules'

class EventsManager {
  constructor(app) {
    this.app = app

    this.init()
  }

  onBlockChange(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onBlockChange(e)
    }

    this.app.wallet?.onBlockChange(this.app.blocks.active)
    this.app.updateTitle()
  }

  onCoinThrow(e) {
    this.app.game?.onCoinThrow(e.detail)
  }

  onOneUp() {
    this.app.wallet?.onOneUp()

    const blockAdded = this.app.blocks?.onOneUp() || false

    if (blockAdded) {
      this.app.nav?.onOneUp()
    }
  }

  onWalletBalanceUpdate(e) {
    this.app.menu.onWalletBalanceUpdate(e.detail)
  }

  onWalletDisplayReady(e) {
    this.app.blocks?.onWalletDisplayReady(e.detail)
    this.app.nav = initNav(Math.floor(e.detail / 100))
    this.app.menu.onWalletDisplayReady(e.detail)
  }

  onTap(e) {
    /**
     * Approach for these events:
     * - runs a sequence of events handlers until a handler stops the chain;
     * - each event is given a `stop` function allowing to… stop the chain.
     *
     * Each event handler is responsible of deciding or not to interrupt the
     * chain. It is useful for cases like “click outside” (close a menu,
     * for example), where you don’t want another “element” that can
     * be clicked to trigger an interaction while a menu is open.
     *
     * @todo: Consider switching from `this.app.module` to a module, like for
     * `ModeSelector`): let’s try this, then evaluate if switching back to
     * the commented code below is better.
     */
    const sequence = [
      this.app.menu,
      ModeSelector,
      this.app.colorSchemes,
      this.app.blocks?.active,
      this.app.nav,
      this.app.settings.volume,
      this.app.settings.rumble,
      this.app,
    ]

    const stop = () => e.shouldStop = true

    /**
     * Bind the module to its onTap and runs the sequence of events.
     * Using `every` exit the “loop” if an handler runs `stop()`.
     */
    sequence
      .map(module => module?.onTap.bind(module))
      .every(handler => {
        handler(e, stop)
        return !e.shouldStop
      })
  }

  /** @param {KeyboardEvent} e */

  onKeyDown(e) {
    if (e.key === 'Tab') { return this.app.nav.onTab(e) }
    if (e.key === ' ') { return this.app.game.onSpace?.(e) }
    if (e.key === 'Enter') { return this.app.game.onEnter?.(e) }

    // @todo: improve Escape sequence with a stop function (?)
    if (e.key === 'Escape') {

      if (this.app.game?.status == 'playing') {

        /**
         * Prevent leaving the fullscreen during Pomodoro.
         *
         * @todo: should be a more elegant system to decide if full screen
         * should be prevented or not.
         */
        if (isFullscreen()) {
          e.preventDefault()
        }

        // this.app.game?.onEscape()
        return this.app.game.pause()
      }
      return this.app.menu.onEscape()
    }
  }

  /** @param {KeyboardEvent} */

  onKeyUp({ key }) {
    if (key === 'ArrowLeft') { return this.app.nav.prev() }
    if (key === 'ArrowRight') { return this.app.nav.next() }
    if (key === 'm') { return this.app.settings.volume.toggle() }
  }

  onAnimationEnd(e) {
    this.app.blocks?.active.onAnimationEnd(e)
  }

  onTransitionEnd(e) {
    this.app.blocks?.active.onTransitionEnd(e)
  }

  onModeChange(e) {
    this.app.initGame()
    this.app.updateTitle()
  }

  onMenuVisibilityChange(e) {
    this.app.colorSchemes.onMenuVisibilityChange(e)
  }

  // onColorSchemeChange(e) {
  //   this.app.colorSchemes.onColorSchemeChange(e)
  // }

  init() {

    // add :hover support in iOS ¯\_(ツ)_/¯
    document.addEventListener('touchstart', () => {})

    document.addEventListener('click', this.onTap.bind(this), captureEvent)
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))

    document.addEventListener('animationend', this.onAnimationEnd.bind(this))
    document.addEventListener('transitionend', this.onTransitionEnd.bind(this))

    document.addEventListener('walletBalanceUpdate', this.onWalletBalanceUpdate.bind(this))
    document.addEventListener('walletDisplayReady', this.onWalletDisplayReady.bind(this))
    document.addEventListener('blockChange', this.onBlockChange.bind(this))
    document.addEventListener('coinThrow', this.onCoinThrow.bind(this))
    document.addEventListener('oneUp', this.onOneUp.bind(this))
    document.addEventListener('modechange', this.onModeChange.bind(this))
    document.addEventListener('menuVisibility', this.onMenuVisibilityChange.bind(this))
    // document.addEventListener('colorSchemeChange', this.onColorSchemeChange.bind(this))
  }

  destroy() {
    console.log('destroy events')

    document.removeEventListener('click', this.onTap.bind(this), captureEvent)
    document.removeEventListener('keydown', this.onKeyDown.bind(this))
    document.removeEventListener('keyup', this.onKeyUp.bind(this))

    document.removeEventListener('animationend', this.onAnimationEnd.bind(this))
    document.removeEventListener('transitionend', this.onTransitionEnd.bind(this))

    document.removeEventListener('walletBalanceUpdate', this.onWalletBalanceUpdate.bind(this))
    document.removeEventListener('walletDisplayReady', this.onWalletDisplayReady.bind(this))
    document.removeEventListener('blockChange', this.onBlockChange.bind(this))
    document.removeEventListener('coinThrow', this.onCoinThrow.bind(this))
    document.removeEventListener('oneUp', this.onOneUp.bind(this))
    document.removeEventListener('modechange', this.onModeChange.bind(this))
  }
}

export default function(app) {
  return new EventsManager(app)
}
