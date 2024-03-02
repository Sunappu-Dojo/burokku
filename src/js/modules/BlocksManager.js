import Block from './Block'

const $ctn = document.getElementById('blocks')
const $backlog = document.getElementById('backlog')
const items = [new Block($ctn.children[0].id)]

class Blocks {
  #activeBlock = items[0]

  get active() {
    return this.#activeBlock
  }

  onWalletDisplayReady(coins) {
    const oneUpQuantity = Math.floor(coins / 100)
    this.#add(oneUpQuantity)
  }

  onBlockChange(e) {
    this.#activeBlock = items[e.detail]
    this.active.onBlockChange()
  }

  /**
   * Try to find and add a block on 1-Up.
   *
   * @return {boolean} true if a block has been found and added.
   */
  onOneUp() {
    return !!this.#add(1)
  }

  /**
   * Add block(s).
   *
   * @return {integer} Number of blocks added.
   */
  #add(quantity = 1) {
    const targetNb = items.length + quantity
    let blocksAdded = 0

    /**
     * For each 1-UP, a hidden block from `div#backlog` become visible by being
     * appended to `div#blocks`. This is repeated…
     * 1. … while you have 1-UPs granting you new blocks…
     * 2. … and until there are no more blocks that are not yet visible.
     */
    while (items.length < targetNb && $backlog.children.length > 0) {
      const { id } = $ctn.appendChild($backlog.children[0])
      items.push(new Block(id))
      blocksAdded++
    }

    return blocksAdded
  }
}

/** @type {Blocks} */
export let blocks

export const initBlocks = () => blocks ??= new Blocks()
