import { E2E_LAYOUT, e2eExploration } from '../../src/explorations/e2eCatalog'
import { visitAsTouch } from '../support/touchVisit'
import { visitExploration } from '../support/visitExploration'

/**
 * Layout representatives only — not a viewport × page matrix.
 * jsdom and default Cypress still report (hover: hover) and (pointer: fine).
 */
describe('Layout', () => {
  it('keeps the 8038 example title readable beside Run, hint below the row', () => {
    const exploration = e2eExploration(E2E_LAYOUT.touchChromeId)
    visitAsTouch(exploration.path)
    cy.get(`#${exploration.id}-c`, { timeout: 15000 }).should('exist')

    cy.get('[data-testid="example-select"]')
      .should('be.visible')
      .and('contain.text', 'Update existing slot')
      .then(($el) => {
        expect($el[0].getBoundingClientRect().width).to.be.greaterThan(160)
      })

    cy.get('[data-testid="run-program"]').should('be.visible')

    cy.get('#eip-8038-c .help-hint-inline')
      .should('be.visible')
      .and('contain.text', 'split touch')
      .then(($hint) => {
        const hint = $hint[0].getBoundingClientRect()
        expect(hint.width, 'hint should span the chrome row, not a word column').to.be.greaterThan(
          200,
        )
        expect(hint.height, 'hint should wrap as a caption, not a tall stack').to.be.lessThan(80)

        const select = Cypress.$('[data-testid="example-select"]')[0].getBoundingClientRect()
        expect(hint.top, 'hint sits under examples + Run').to.be.at.least(select.bottom - 12)
      })
  })

  it('opens the 7708 companion sheet from peek on a phone-sized viewport', () => {
    const exploration = e2eExploration(E2E_LAYOUT.companionId)
    cy.viewport(412, 915)
    visitExploration(exploration)

    cy.get('[data-testid="companion-peek"]').should('be.visible').click()
    cy.get(`[data-testid="${E2E_LAYOUT.companionPanelTestId}"]`).should('be.visible')

    cy.get('body').then(($body) => {
      expect($body[0].scrollWidth, 'companion page should not overflow the viewport').to.be.lte(
        $body[0].clientWidth + 1,
      )
    })
  })
})
