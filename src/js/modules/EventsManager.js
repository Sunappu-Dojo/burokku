import { ModeSelector, blocks, colorSchemes, game, menu, nav, rumble, volume, wallet } from '.'
import { initNav } from './Nav'
import { serviceWorkerHandlers } from './ServiceWorker'
import { captureEvent } from '../utils/EventListenerOptions'
import { isFullscreen } from '../utils/MediaQueries'

const onBlockChange = e => {
  blocks?.onBlockChange(e)
  wallet?.onBlockChange(blocks.active)
  game?.onBlockChange?.()
}

const onOneUp = () => {
  wallet?.onOneUp()

  const blockAdded = blocks?.onOneUp() || false

  if (blockAdded) {
    nav?.onOneUp()
  }
}

const onWalletBalanceUpdate = (e) => menu.onWalletBalanceUpdate(e.detail)

const onWalletDisplayReady = (e) => {
  blocks?.onWalletDisplayReady(e.detail)
  initNav(Math.floor(e.detail / 100))
  menu.onWalletDisplayReady(e.detail)
}

const onCoinThrow = e => game?.onCoinThrow(e)

const onTap = (e) => {
  /**
   * Approach for these events:
   * - runs a sequence of events handlers until a handler stops the chain;
   * - each event is given a `stop` function allowing to… stop the chain.
   *
   * Each event handler is responsible of deciding or not to interrupt the
   * chain. It is useful for cases like “click outside” (close a menu,
   * for example), where you don’t want another “element” that can
   * be clicked to trigger an interaction while a menu is open.
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

const onKeyDown = (e) => {
  if (e.key === 'Tab') { return nav.onTab(e) }
  if (e.key === ' ') { return game.onSpace?.(e) }
  if (e.key === 'Enter') { return game.onEnter?.(e) }

  // @todo: improve Escape sequence with a stop function (?)
  if (e.key === 'Escape') {
    if (game.status == 'playing') {

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

const onKeyUp = ({ key }) => {
  if (key === 'ArrowLeft') { return nav.prev() }
  if (key === 'ArrowRight') { return nav.next() }
  if (key === 'm') { return volume.toggle() }
}

const onAnimationEnd = e => blocks?.active.onAnimationEnd(e)
const onTransitionEnd = e => blocks?.active.onTransitionEnd(e)

const onModeChange = e => {
  game.initGame()
  game.updateTitle()
}

const onMenuVisibilityChange = e => colorSchemes.onMenuVisibilityChange(e)

// const onColorSchemeChange = (e) => colorSchemes.onColorSchemeChange(e)

const init = () => {

  // add :hover support in iOS ¯\_(ツ)_/¯
  document.addEventListener('touchstart', () => {})

  document.addEventListener('click', onTap, captureEvent)
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)

  document.addEventListener('animationend', onAnimationEnd)
  document.addEventListener('transitionend', onTransitionEnd)

  document.addEventListener('walletBalanceUpdate', onWalletBalanceUpdate)
  document.addEventListener('walletDisplayReady', onWalletDisplayReady)
  document.addEventListener('blockChange', onBlockChange)
  document.addEventListener('coinThrow', onCoinThrow)
  document.addEventListener('oneUp', onOneUp)
  document.addEventListener('modechange', onModeChange)
  document.addEventListener('menuVisibility', onMenuVisibilityChange)
  // document.addEventListener('colorSchemeChange', onColorSchemeChange)
}

// const destroy = () => {
//   console.log('destroy events')

//   document.removeEventListener('click', onTap, captureEvent)
//   document.removeEventListener('keydown', onKeyDown)
//   document.removeEventListener('keyup', onKeyUp)

//   document.removeEventListener('animationend', onAnimationEnd)
//   document.removeEventListener('transitionend', onTransitionEnd)

//   document.removeEventListener('walletBalanceUpdate', onWalletBalanceUpdate)
//   document.removeEventListener('walletDisplayReady', onWalletDisplayReady)
//   document.removeEventListener('blockChange', onBlockChange)
//   document.removeEventListener('coinThrow', onCoinThrow)
//   document.removeEventListener('oneUp', onOneUp)
//   document.removeEventListener('modechange', onModeChange)
//   document.removeEventListener('menuVisibility', onMenuVisibilityChange)
//   document.removeEventListener('colorSchemeChange', onColorSchemeChange)
// }

export default function() {
  return init()
}
