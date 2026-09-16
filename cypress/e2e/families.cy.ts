import { E2E_FAMILY_PLAY, e2eExploration } from '../../src/explorations/e2eCatalog'
import { visitExploration } from '../support/visitExploration'

const RUN_TIMEOUT = 15000

describe('Exploration families (one play path each)', () => {
  for (const play of E2E_FAMILY_PLAY) {
    const exploration = e2eExploration(play.id)

    it(`${play.family}: ${play.id} ${play.kind}`, () => {
      visitExploration(exploration)

      if (play.kind === 'select-example') {
        const result = `#${exploration.id}-c .post-hardfork .e-result-text-lg`
        cy.get(result)
          .first()
          .invoke('text')
          .then((before) => {
            cy.get('[data-testid="example-select"]').click()
            cy.get(`[data-testid="${play.exampleTestId}"]`).click()
            cy.get(result, { timeout: RUN_TIMEOUT })
              .first()
              .should((el) => {
                expect(el.text()).not.to.eq(before)
              })
          })
        return
      }

      cy.get(`[data-testid="${play.testId}"]`).should('be.visible').click()

      if ('doneTestId' in play) {
        cy.get(`[data-testid="${play.doneTestId}"]`, { timeout: RUN_TIMEOUT }).should(
          'have.attr',
          play.doneAttr,
          play.doneValue,
        )
        return
      }

      cy.contains('Gas used:', { timeout: RUN_TIMEOUT })
      cy.get('[data-disassembly-active="true"]').should('exist')
    })
  }
})
