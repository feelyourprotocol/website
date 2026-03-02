describe('EIP-7951/secp256r1 Precompile Support', () => {
  it('initialization', () => {
    cy.visit('/eip-7951-secp256r1-precompile')

    // Basic component display
    cy.contains('h1', 'Feel Your Protocol')
    cy.contains('h3', 'secp256r1 Precompile Support')

    // Values from inital example
    cy.get('#eip-7951-c textarea', { timeout: 10000 }).should(
      'contain.value',
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933',
    )
    const val = '3b91fedfb22f40063245c621036a040c159f02ae02e6d450ff9b53235e9232c4'
    cy.get('#eip-7951-c input').eq(2).should('have.value', val)

    cy.get('.post-hardfork').find('p').eq(0).should('include.text', '6900 Gas')

    // Select different example
    cy.get('#eip-7951-c')
      .find('select')
      .select('Invalid (Wycheproof), r value too large')
    cy.get('#eip-7951-c textarea', { timeout: 10000 }).should(
      'contain.value',
      '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
    )
    cy.get('#eip-7951-c input')
      .eq(2)
      .should('have.value', 'ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc63254e')
    cy.get('.post-hardfork').find('p').eq(0).should('include.text', '6900 Gas')
  })
})
