import { captureEvent } from '../helpers/EventListenerOptions'

class EventsManager {
  constructor(app) {
    this.app = app

    this.init()
  }

  onBlockChange(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onBlockChange(e)
    }
  }

  onCoinThrow(e) {
    if ('wallet' in this.app) {
      this.app.wallet.onCoinThrow(e.detail)
    }
  }

  onOneUp() {
    let blockAdded = false

    if ('blocks' in this.app) {
      blockAdded = this.app.blocks.onOneUp()
    }

    if (blockAdded && 'nav' in this.app) {
      this.app.nav.onOneUp()
    }
  }

  onWalletDisplayReady(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onWalletDisplayReady(e.detail)
    }

    if ('nav' in this.app) {
      this.app.nav.update()
    }
  }

  onTap(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onTap(e)
    }

    if ('nav' in this.app) {
      this.app.nav.onTap(e)
    }

    if ('sw' in this.app) {
      this.app.onTap(e)
    }
  }

  onKeyDown(e) {
    if (e.key === 'Tab') { return this.app.nav.onTab(e) }
    if (e.key === ' ') { return this.app.blocks.onSpace(e) }
    if (e.key === 'Enter') { return this.app.blocks.onEnter(e) }
  }

  onKeyUp({ key, target }) {
    if (key === 'ArrowLeft') { return this.app.nav.prev() }
    if (key === 'ArrowRight') { return this.app.nav.next() }
  }

  onAnimationEnd(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onAnimationEnd(e)
    }
  }

  onTransitionEnd(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onTransitionEnd(e)
    }
  }

  init() {

    // add :hover support in iOS ¯\_(ツ)_/¯
    document.addEventListener('touchstart', () => {})

    document.addEventListener('click', this.onTap.bind(this), captureEvent)
    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))

    document.addEventListener('animationend', this.onAnimationEnd.bind(this))
    document.addEventListener('transitionend', this.onTransitionEnd.bind(this))

    document.addEventListener('walletDisplayReady', this.onWalletDisplayReady.bind(this))
    document.addEventListener('blockChange', this.onBlockChange.bind(this))
    document.addEventListener('coinThrow', this.onCoinThrow.bind(this))
    document.addEventListener('oneUp', this.onOneUp.bind(this))
  }
}

export default function(app) {
  return new EventsManager(app)
}
