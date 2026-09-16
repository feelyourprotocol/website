import { visitAsTouch } from '../support/touchVisit'

/**
 * Widget chrome on a phone-sized viewport with hover disabled.
 * Catches Run-hint / examples-select collisions that jsdom and default Cypress miss.
 */
describe('Widget chrome on touch', () => {
  it('keeps the 8038 example title readable beside Run, hint below the row', () => {
    visitAsTouch('/eip-8038-state-access-gas')
    cy.get('#eip-8038-c', { timeout: 10000 }).should('exist')

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
})
