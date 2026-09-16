describe('Home', () => {
  it('loads intro, topics, and exploration cards', () => {
    cy.visit('/')
    cy.get('[data-testid="home-intro-panel"]').should('be.visible')
    cy.get('[data-mcp-launch-week]').should('exist')
    cy.contains('h2', 'Scaling').should('be.visible')
    cy.get('.exploration-c').should('have.length.gte', 1)
  })

  it('topic link navigates to topic page', () => {
    cy.visit('/')
    cy.contains('h2', 'Scaling').closest('a').click()
    cy.url().should('include', '/scaling')
  })

  it('exploration card navigates to exploration page', () => {
    cy.visit('/')
    cy.get('.exploration-c').first().closest('a').click()
    cy.url().should('match', /\/eip-\d+/)
  })
})

describe('Imprint', () => {
  it('loads and shows key sections', () => {
    cy.visit('/imprint')
    cy.contains('h3', 'ABOUT')
    cy.contains('h3', 'ACKNOWLEDGEMENTS')
    cy.contains('h3', 'DATA')
  })
})

describe('404', () => {
  it('shows a friendly not-found page with navigation options', () => {
    cy.visit('/this-path-does-not-exist', { failOnStatusCode: false })
    cy.contains("This path isn't in the registry.")
    cy.contains('← Home')
    cy.contains('Add an exploration')
    cy.get('img').should('be.visible')
  })
})

describe('Navigation', () => {
  it('full navigation flow through the site', () => {
    cy.visit('/')
    cy.get('header').contains('Feel Your Protocol')
    cy.get('footer').contains('Imprint')

    cy.get('#exploration-navi').click()
    cy.contains('[role="option"]', 'EIP-7883').click()
    cy.url().should('include', '/eip-7883')

    cy.get('footer').contains('Imprint').click()
    cy.url().should('include', '/imprint')

    cy.get('header').contains('Feel Your Protocol').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
