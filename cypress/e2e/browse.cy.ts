import { E2E_EXPLORATIONS } from '../../src/explorations/e2eCatalog'

describe('Browse', () => {
  it('lists every live exploration on /all', () => {
    cy.visit('/all')
    cy.contains('h1', 'All explorations')
    cy.get('[data-testid="exploration-catalog-grid"] > a').should(
      'have.length',
      E2E_EXPLORATIONS.length,
    )
  })

  it('loads a topic catalog with preview cards', () => {
    cy.visit('/scaling')
    cy.contains('h1', 'Scaling')
    cy.get('[data-testid="exploration-catalog-grid"]').should('exist')
    cy.get('#eip-7928-c').should('exist')
  })

  it('filters /all when a tag is clicked', () => {
    cy.visit('/all')
    cy.get('.tag-item').first().click()
    cy.url().should('include', 'tag=')
    cy.get('[data-testid="exploration-catalog-grid"] a').should('have.length.gte', 1)
    cy.contains('Clear filters').should('be.visible')
  })
})
