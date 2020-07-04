import Block from '../Block'

class Blocks {
  constructor() {
    this.items = [
      new Block('smb'),
      new Block('smb3'),
    ]

    this.active = this.items[0]
  }

  onBlockChange(e) {
    this.active = this.items[e.detail]
  }

  onTap(e) {
    this.active.onTap(e)
  }

  onAnimationEnd(e) {
    this.active.onAnimationEnd(e)
  }
}

export default function() {
  return new Blocks()
}
