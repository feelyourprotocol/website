/**
 * EIP-7823 is the representative EIP for the precompile component tests.
 */
describe('EIP-7823/Precompile Component Tests', () => {
  let bytesLengthsExpected =
    '0000000000000000000000000000000000000000000000000000000000000001' +
    '0000000000000000000000000000000000000000000000000000000000000001' +
    '0000000000000000000000000000000000000000000000000000000000000001'
  const bytesValuesExpected = '030302'
  let bytesExpected = bytesLengthsExpected + bytesValuesExpected

  it('initialization', () => {
    cy.visit('/eip-7883-modexp-gas-cost-increase')

    cy.contains('h1', 'Feel Your Protocol')
    cy.contains('h3', 'ModExp')

    cy.get('#eip-7883-precompile-c textarea', { timeout: 10000 }).should(
      'have.value',
      bytesExpected,
    )
    cy.get('#eip-7883-precompile-c input').eq(0).should('have.value', '03')
    cy.get('#eip-7883-precompile-c input').eq(1).should('have.value', '03')
    cy.get('#eip-7883-precompile-c input').eq(2).should('have.value', '02')

    cy.get('.pre-hardfork').find('p').eq(0).should('include.text', '200 Gas')
    cy.get('.post-hardfork').find('p').eq(0).should('include.text', '500 Gas')
  })

  it('values -> data', () => {
    cy.visit('/eip-7883-modexp-gas-cost-increase')

    // Simple initial case
    bytesExpected = bytesLengthsExpected + '040402'
    cy.get('#eip-7883-precompile-c').within(() => {
      cy.get('input').eq(0).clear()
      cy.get('input').eq(1).clear()
      cy.get('input').eq(2).clear()
      cy.get('input').eq(0).type('04')
      cy.get('input').eq(1).type('04')
      cy.get('input').eq(2).type('02')
    })
    cy.get('textarea').should('have.value', bytesExpected)

    // Slightly modified values case
    bytesLengthsExpected =
      '0000000000000000000000000000000000000000000000000000000000000002' +
      '0000000000000000000000000000000000000000000000000000000000000002' +
      '0000000000000000000000000000000000000000000000000000000000000002'
    bytesExpected = bytesLengthsExpected + '040404040202'
    cy.get('#eip-7883-precompile-c').within(() => {
      cy.get('input').eq(0).type('04')
      cy.get('input').eq(1).type('04')
      cy.get('input').eq(2).type('02')
    })
    cy.get('textarea').should('have.value', bytesExpected)

    cy.get('#eip-7883-precompile-c').within(() => {
      // Gas changing example
      cy.get('input').eq(0).type('040404040404040404040404040404040404040404')
      cy.get('input').eq(1).type('040404040404040404040404040404040404040404')
      cy.get('input').eq(2).type('02')

      cy.get('.pre-hardfork').find('p').eq(0).should('include.text', '534 Gas')
      cy.get('.post-hardfork').find('p').eq(0).should('include.text', '2848 Gas')
    })
  })

  it('data -> values, URL sharing, EIP button', () => {
    cy.visit('/eip-7883-modexp-gas-cost-increase')

    cy.get('#eip-7883-precompile-c').within(() => {
      cy.window().then((win) => {
        cy.stub(win, 'open').callsFake((url) => {
          win.location.href = url // Redirect within the same tab
        })
      })
      // data -> values
      cy.get('textarea').clear()
      cy.get('textarea').type(bytesExpected) // '040404040202'
      cy.get('input').eq(0).should('have.value', '0404')
      cy.get('input').eq(1).should('have.value', '0404')
      cy.get('input').eq(2).should('have.value', '0202')

      // URL sharing
      cy.get('.share-url-button').click()
      cy.url().should('include', 'b=0404')
      cy.url().should('include', 'e=0404')
      cy.url().should('include', 'm=0202')

      cy.get('textarea').should('have.value', bytesExpected)
      cy.get('input').eq(0).should('have.value', '0404')
      cy.get('input').eq(1).should('have.value', '0404')
      cy.get('input').eq(2).should('have.value', '0202')

      // examples
      cy.get('.examples-select').select('Simple')
      cy.get('input').eq(0).should('have.value', '03')
      cy.get('input').eq(1).should('have.value', '03')
      cy.get('input').eq(2).should('have.value', '02')

      // EIP button
      cy.get('.visit-exploration-button').invoke('removeAttr', 'target').click()
      cy.origin('https://eips.ethereum.org', () => {
        cy.url().should('eq', 'https://eips.ethereum.org/EIPS/eip-7883')
      })
    })
  })
})
