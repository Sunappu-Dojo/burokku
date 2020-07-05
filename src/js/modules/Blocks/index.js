import Block from '../Block'

const ctn = document.getElementById('blocks')
const backlog = document.getElementById('backlog')

class Blocks {
  constructor() {
    this.items = [new Block(ctn.children[0].id)]
    this.active = this.items[0]
    this.active.focus()
  }

  onWalletDisplayReady(coins) {
    const oneUpQuantity = Math.floor(coins / 100)
    this.add(oneUpQuantity)
  }

  onBlockChange(e) {
    this.active = this.items[e.detail]
  }

  onOneUp() {
    this.add(1)
  }

  onTap(e) {
    this.active.onTap(e)
  }

  onAnimationEnd(e) {
    this.active.onAnimationEnd(e)
  }

  onTransitionEnd(e) {
    this.active.onTransitionEnd(e)
  }

  /**
   * Add bumpable blocks.
   */
  add(quantity = 1) {
    const targetNb = this.items.length + quantity

    /**
     * For each 1-UP, a hidden block from div#backlog become visible by being
     * appended to div#blocks. This is repeated while:
     * 1. You have 1-UPs granting you new blocks.
     * 2. There are invisible blocks that can become visible.
     */
    while (this.items.length < targetNb && backlog.children.length > 0) {
      const { id } = ctn.appendChild(backlog.children[0])
      this.items.push(new Block(id))
    }
  }
}

export default function() {
  return new Blocks()
}
