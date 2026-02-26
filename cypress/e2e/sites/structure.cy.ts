describe('Site Structure', () => {
  it('header renders on every page', () => {
    for (const path of ['/', '/fusaka', '/eip-7883-modexp-gas-cost-increase', '/imprint']) {
      cy.visit(path)
      cy.get('header').within(() => {
        cy.contains('h1', 'Feel Your Protocol')
        cy.get('nav').should('exist')
      })
    }
  })

  it('footer renders on every page', () => {
    for (const path of ['/', '/fusaka', '/eip-7883-modexp-gas-cost-increase', '/imprint']) {
      cy.visit(path)
      cy.get('footer').within(() => {
        cy.contains('a', 'Imprint')
        cy.contains('a', 'GitHub')
      })
    }
  })

  it('navigation links work', () => {
    cy.visit('/')

    cy.contains('h2', 'Fusaka').click()
    cy.url().should('include', '/fusaka')

    cy.get('#exploration-navi').select('EIP-7883')
    cy.url().should('include', '/eip-7883')

    cy.get('footer').contains('Imprint').click()
    cy.url().should('include', '/imprint')

    cy.contains('h1', 'Feel Your Protocol').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('exploration dropdown lists all explorations', () => {
    cy.visit('/')
    cy.get('#exploration-navi option').should('have.length.gte', 4)
    cy.get('#exploration-navi').contains('EIP-7594')
    cy.get('#exploration-navi').contains('EIP-7883')
    cy.get('#exploration-navi').contains('EIP-7951')
  })
})
