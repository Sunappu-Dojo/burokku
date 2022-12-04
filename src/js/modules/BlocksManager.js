import Block from './Block'

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
    this.active.onBlockChange()
  }

  /**
   * Try to find and add a block on 1-Up.
   *
   * @return {boolean} true if a block has been found and added.
   */
  onOneUp() {
    return !!this.add(1)
  }

  /**
   * Add block(s).
   *
   * @return {integer} Number of blocks added.
   */
  add(quantity = 1) {
    const targetNb = this.items.length + quantity
    let blocksAdded = 0

    /**
     * For each 1-UP, a hidden block from `div#backlog` become visible by being
     * appended to `div#blocks`. This is repeated while:
     * 1. You have 1-UPs granting you new blocks.
     * 2. There are invisible blocks that can become visible.
     */
    while (this.items.length < targetNb && backlog.children.length > 0) {
      const { id } = ctn.appendChild(backlog.children[0])
      this.items.push(new Block(id))
      blocksAdded++
    }

    return blocksAdded
  }
}

export default function() {
  return new Blocks()
}
