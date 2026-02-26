describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders intro and project overview', () => {
    cy.contains('Interactive Ethereum Protocol Explorations')
    cy.contains('About the Project')
    cy.contains('Feel Your Protocol is a collaborative open-source project')
  })

  it('renders topic box with dancer', () => {
    cy.contains('h2', 'Fusaka')
    cy.get('img').should('exist')
  })

  it('featured exploration boxes have entries and links work', () => {
    cy.get('.exploration-precompile-c').should('have.length.gte', 1)
    cy.get('.exploration-precompile-c').first().parents('a').click()
    cy.url().should('include', '/eip-')
  })
})
