import { E2E_EXPLORATIONS } from '../../src/explorations/e2eCatalog'
import { visitExploration } from '../support/visitExploration'

describe('Explorations (catalog)', () => {
  for (const exploration of E2E_EXPLORATIONS) {
    it(`loads ${exploration.id} with an example picker`, () => {
      visitExploration(exploration)
      cy.get('[data-testid="example-select"]').should('be.visible').click()
      cy.get('[role="option"]').should('have.length.gte', 2)
      cy.get('h1').click()
    })
  }
})
