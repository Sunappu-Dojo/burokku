const env = Cypress.env()

const walletValue = el => parseInt(el.text())

describe('Initialization', () => {
  it('loads the website', () => { cy.visit(env['BASE_URL']) })

  it('has at least one block', () => { cy.contains('Jump!') })

  it('has an empty wallet', () => cy.get('.wallet__amount').then(el =>
    expect(walletValue(el)).to.be.equal(0)
  ))
})

