import { captureEvent } from '../helpers/EventListenerOptions'
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
    if ('wallet' in this.app) {
      this.app.wallet.onCoinThrow(e.detail)
      this.app.updateTitle()
    }
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
    this.app.blocks?.active.onTap(e)
    this.app.nav?.onTap(e)
    this.app.settings.volume?.onTap(e)
    this.app.settings.rumble?.onTap(e)

    if ('sw' in this.app) {
      this.app.onTap(e)
    }
    ModeSelector.onTap(e)
    this.app.menu.onTap(e)
  }

  onKeyDown(e) {
    if (e.key === 'Escape') { return this.app.menu.onEscape(e) }
    if (e.key === 'Tab') { return this.app.nav.onTab(e) }
    if (e.key === ' ') { return this.app.blocks.active.onSpace(e) }
    if (e.key === 'Enter') { return this.app.blocks.active.onEnter(e) }
  }

  onKeyUp({ key, target }) {
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
  }

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
  }
}

export default function(app) {
  return new EventsManager(app)
}
