describe('Home', () => {
  it('loads and displays topics and explorations', () => {
    cy.visit('/')
    cy.contains('h2', 'Fusaka').should('be.visible')
    cy.get('.exploration-c').should('have.length.gte', 1)
  })

  it('topic link navigates to topic page', () => {
    cy.visit('/')
    cy.contains('h2', 'Fusaka').closest('a').click()
    cy.url().should('include', '/fusaka')
  })

  it('exploration card navigates to exploration page', () => {
    cy.visit('/')
    cy.get('.exploration-c').first().closest('a').click()
    cy.url().should('match', /\/eip-\d+/)
  })
})

describe('Topic (Fusaka)', () => {
  it('loads all exploration widgets', () => {
    cy.visit('/fusaka')
    cy.get('#eip-7883-c', { timeout: 10000 }).should('exist')
    cy.get('#eip-7594-c', { timeout: 10000 }).should('exist')
    cy.get('#eip-7951-c', { timeout: 10000 }).should('exist')
  })
})

describe('Imprint', () => {
  it('loads and shows key sections', () => {
    cy.visit('/imprint')
    cy.contains('h3', 'CONTACT')
    cy.contains('h3', 'ACKNOWLEDGEMENTS')
    cy.contains('h3', 'DATA')
  })
})

describe('Navigation', () => {
  it('full navigation flow through the site', () => {
    cy.visit('/')
    cy.get('header').contains('Feel Your Protocol')
    cy.get('footer').contains('Imprint')

    cy.get('#exploration-navi').select('EIP-7883')
    cy.url().should('include', '/eip-7883')

    cy.get('footer').contains('Imprint').click()
    cy.url().should('include', '/imprint')

    cy.contains('h1', 'Feel Your Protocol').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
