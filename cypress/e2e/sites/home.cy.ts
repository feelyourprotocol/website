describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders intro content', () => {
    cy.contains('Interactive Ethereum Protocol Explorations')
    cy.contains('For the Community.')
    cy.contains('For Builders.')
    cy.contains('For Testers.')
    cy.contains('For Researchers.')
  })

  it('latest EIPs section has entries and links work', () => {
    cy.get('#latest-navi li').should('have.length.gte', 1)
    cy.get('#latest-navi li').first().find('a').click()
    cy.url().should('include', '/eip-')
  })
})
