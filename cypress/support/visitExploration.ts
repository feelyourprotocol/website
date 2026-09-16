/// <reference types="cypress" />

import type { E2eExploration } from '../../src/explorations/e2eCatalog'

/** Full exploration page: widget root + shared ready hook. */
export function visitExploration(exploration: E2eExploration) {
  cy.visit(exploration.path)
  cy.get(`#${exploration.id}-c`, { timeout: 15000 }).should('exist')
  cy.get('[data-testid="exploration-ready"]').should('exist')
}

export {}
