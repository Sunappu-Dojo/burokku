import { captureEvent } from '../helpers/EventListenerOptions'
import { ModeSelector, blocks, colorSchemes, game, menu, nav, rumble, volume, wallet } from '../modules'
import { initNav } from '../modules/Nav'
import { serviceWorkerHandlers } from '../modules/ServiceWorker'
import { isFullscreen } from '../utils/MediaQueries'

class EventsManager {
  constructor() {
    this.init()
  }

  onBlockChange(e) {
    blocks?.onBlockChange(e)
    wallet?.onBlockChange(blocks.active)
  }

  onCoinThrow(e) {
    game?.onCoinThrow(e)
  }

  onOneUp() {
    wallet?.onOneUp()

    const blockAdded = blocks?.onOneUp() || false

    if (blockAdded) {
      nav?.onOneUp()
    }
  }

  onWalletBalanceUpdate(e) {
    menu.onWalletBalanceUpdate(e.detail)
  }

  onWalletDisplayReady(e) {
    blocks?.onWalletDisplayReady(e.detail)
    initNav(Math.floor(e.detail / 100))
    menu.onWalletDisplayReady(e.detail)
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
     * @todo: Consider switching from `game.module` to a module, like for
     * `ModeSelector`): let’s try this, then evaluate if switching to
     * the commented code below is better.
     */
    const sequence = [
      menu,
      ModeSelector,
      colorSchemes,
      blocks?.active,
      nav,
      volume,
      rumble,
      serviceWorkerHandlers,
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
    if (e.key === 'Tab') { return nav.onTab(e) }
    if (e.key === ' ') { return game.onSpace?.(e) }
    if (e.key === 'Enter') { return game.onEnter?.(e) }

    // @todo: improve Escape sequence with a stop function (?)
    if (e.key === 'Escape') {

      if (game.game?.status == 'playing') {

        /**
         * Prevent leaving the fullscreen during Pomodoro.
         *
         * @todo: should be a more elegant system to decide if full screen
         * should be prevented or not.
         */
        if (isFullscreen()) {
          e.preventDefault()
        }

        // game.game?.onEscape()
        return game.game.pause()
      }
      return menu.onEscape()
    }
  }

  /** @param {KeyboardEvent} */

  onKeyUp({ key }) {
    if (key === 'ArrowLeft') { return nav.prev() }
    if (key === 'ArrowRight') { return nav.next() }
    if (key === 'm') { return volume.toggle() }
  }

  onAnimationEnd(e) {
    blocks?.active.onAnimationEnd(e)
  }

  onTransitionEnd(e) {
    blocks?.active.onTransitionEnd(e)
  }

  onModeChange(e) {
    console.log('mode change')
    game.initGame()
    game.updateTitle()
  }

  onMenuVisibilityChange(e) {
    colorSchemes.onMenuVisibilityChange(e)
  }

  // onColorSchemeChange(e) {
  //   colorSchemes.onColorSchemeChange(e)
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

export default function() {
  return new EventsManager()
}
