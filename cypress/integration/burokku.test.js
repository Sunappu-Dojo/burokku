const env = Cypress.env()

const walletValue = el => parseInt(el.text())

describe('Initialization', () => {
  it('loads the website', () => { cy.visit(env['BASE_URL']) })

  it('has at least one block', () => { cy.contains('Jump!') })

  it('has only one visible block')

  it('has an empty wallet', () => cy.get('.wallet__amount').then(el =>
    expect(walletValue(el)).to.be.equal(0)
  ))

  it('has no visible navigation arrows')
})

describe('Block', () => {
  it('hits the block', () => { cy.contains('Jump!').click() })

  it('puts a coin in the wallet', () => cy.get('.wallet__amount').then(el =>
    expect(walletValue(el)).to.be.equal(1)
  ))

  it('plays a sound when the block is hit')
})

describe('Wallet', () => {
  it('unlocks a block when reaching a threshold')
  it('does not unlock a block if all blocks are unlocked')
})

describe('Navigation', () => {
  it('doesn’t select another block when navigation arrows are not available')
  it('selects another block when hitting a navigation arrow')
})
