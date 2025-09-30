describe('EIP-7823 Component Tests', () => {
  it('checks if the precompile component works', () => {
    cy.visit('/')
    cy.contains('Fusaka').click()

    const bytesExpected =
      '0000000000000000000000000000000000000000000000000000000000000001' +
      '0000000000000000000000000000000000000000000000000000000000000001' +
      '0000000000000000000000000000000000000000000000000000000000000001' +
      '020202'
    cy.get('textarea').should('have.value', bytesExpected)
  })
})
