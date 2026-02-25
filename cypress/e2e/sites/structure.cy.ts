describe('Site Structure', () => {
  it('header renders on every page', () => {
    for (const path of ['/', '/fusaka', '/eip-7883-modexp-gas-cost-increase', '/imprint']) {
      cy.visit(path)
      cy.get('header').within(() => {
        cy.contains('h1', 'feelyourprotocol')
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

    cy.get('nav').contains('Fusaka').click()
    cy.url().should('include', '/fusaka')

    cy.get('#eip-navi').select('EIP-7883')
    cy.url().should('include', '/eip-7883')

    cy.get('footer').contains('Imprint').click()
    cy.url().should('include', '/imprint')

    cy.contains('h1', 'feelyourprotocol').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('EIP dropdown lists all EIPs', () => {
    cy.visit('/')
    cy.get('#eip-navi option').should('have.length.gte', 4)
    cy.get('#eip-navi').contains('EIP-7594')
    cy.get('#eip-navi').contains('EIP-7883')
    cy.get('#eip-navi').contains('EIP-7951')
  })
})
