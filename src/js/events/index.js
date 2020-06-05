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

    if ('sw' in this.app) {
      this.app.onTap(e)
    }
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

    document.addEventListener('animationend', this.onAnimationEnd.bind(this))
  }
}
