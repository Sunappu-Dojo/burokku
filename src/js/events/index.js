import { captureEvent } from './optionsSupport'

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

  onKeyUp({ key }) {
    if (key === 'ArrowLeft') { return this.app.nav.prev() }
    if (key === 'ArrowRight') { return this.app.nav.next() }
  }

  onAnimationEnd(e) {
    if ('blocks' in this.app) {
      this.app.blocks.onAnimationEnd(e)
    }
  }

  init() {

    // add :hover support in iOS ¯\_(ツ)_/¯
    document.addEventListener('touchstart', () => {})

    document.addEventListener('click', this.onTap.bind(this), captureEvent)
    document.addEventListener('keyup', this.onKeyUp.bind(this))

    document.addEventListener('animationend', this.onAnimationEnd.bind(this))

    document.addEventListener('blockChange', this.onBlockChange.bind(this))
  }
}

export default function(app) {
  return new EventsManager(app)
}
