import { captureEvent } from './optionsSupport'

export default class {
  constructor(app) {
    this.app = app

    this.init()
  }

  onTap(e) {
    if ('block' in this.app) {
      this.app.block.onTap(e)
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
    if ('block' in this.app) {
      this.app.block.onAnimationEnd(e)
    }
  }

  init() {

    // add :hover support in iOS ¯\_(ツ)_/¯
    document.addEventListener('touchstart', () => {})

    document.addEventListener('click', this.onTap.bind(this), captureEvent)
    document.addEventListener('keyup', this.onKeyUp.bind(this))

    document.addEventListener('animationend', this.onAnimationEnd.bind(this))
  }
}
