const env = Cypress.env()

const walletValue = el => parseInt(el.text())

describe('Initialization', () => {
  it('loads the website', () => { cy.visit(env['BASE_URL']) })

  it('has at least one block', () => { cy.contains('Jump!') })

  it('has an empty wallet', () => cy.get('.wallet__amount').then(el =>
    expect(walletValue(el)).to.be.equal(0)
  ))
})

describe('Block', () => {
  it('hits the block', () => { cy.contains('Jump!').click() })

  it('puts a coin in the wallet', () => cy.get('.wallet__amount').then(el =>
    expect(walletValue(el)).to.be.equal(1)
  ))
})
