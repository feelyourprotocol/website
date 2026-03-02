describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Topics', () => {
    it('renders at least one topic with title, image, and intro text', () => {
      cy.contains('h2', 'Fusaka').should('be.visible')
      cy.get('h2').contains('Fusaka').closest('a').find('img').should('exist')
      cy.contains("Fusaka is Ethereum's next major network upgrade")
    })

    it('topic links to its dedicated page', () => {
      cy.contains('h2', 'Fusaka').closest('a').click()
      cy.url().should('include', '/fusaka')
    })
  })

  describe('About section', () => {
    it('renders project description', () => {
      cy.contains('About the Project').should('be.visible')
      cy.contains('Feel Your Protocol is a collaborative open-source project')
    })

    it('has link to contributor docs', () => {
      cy.contains('a', 'Check the docs')
        .should('have.attr', 'href', 'https://docs.feelyourprotocol.org')
        .and('have.attr', 'target', '_blank')
    })

    it('has link to GitHub repo', () => {
      cy.contains('a', 'code on GitHub')
        .should('have.attr', 'href', 'https://github.com/feelyourprotocol/website')
        .and('have.attr', 'target', '_blank')
    })
  })

  describe('Featured explorations', () => {
    it('shows "Latest" label', () => {
      cy.contains('Latest').should('be.visible')
    })

    it('renders three featured exploration cards', () => {
      cy.get('.exploration-c').should('have.length', 3)
    })

    it('each card displays a title and intro text', () => {
      cy.get('.exploration-c').each(($card) => {
        cy.wrap($card).find('h3').should('not.be.empty')
        cy.wrap($card).find('.font-mono').should('exist')
      })
    })

    it('clicking an exploration card navigates to its page', () => {
      cy.get('.exploration-c').first().closest('a').click()
      cy.url().should('match', /\/eip-\d+/)
    })
  })
})
