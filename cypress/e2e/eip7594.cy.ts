describe('EIP-7594/PeerDAS Tests', () => {
  it('initialization', () => {
    cy.visit('/eip-7594-peerdas-data-availability-sampling')

    // Basic component display
    cy.contains('h1', 'Feel Your Protocol')
    cy.contains('h3', 'Peer Data Availability Sampling')

    // Values from inital example
    cy.get('#eip-7594-c textarea', { timeout: 10000 }).should(
      'contain.value',
      '0a0001fbfc0084bd8494e56454b36510b0adc8aaa1b60',
    )

    // Select different example
    cy.get('#eip-7594-c').find('select').select(2)
    cy.get('#eip-7594-c textarea', { timeout: 10000 }).should(
      'contain.value',
      '00000000000000000000000000000000000000000',
    )

    cy.get('.run-button').click()
    let text =
      '0xa522f1be9ec4a02fcb6998b10306e94331311ac29bcaaae357d8d7fbc087a04b5b66dd7fa84cbebabcc45202b8fee57f'
    cy.get('#eip-7594-c .4844-7594-box')
      .find('table tr:first td:nth-child(2)')
      .should('contain.text', text, { timeout: 25000 })
    text =
      '0x8bd1e6e38b2b54735c6f0102022510cf2abc2e4c6c5a437cba9831662c9f112e61e2a6ced8ce63b3de18cb9cc99ae21e'
    cy.get('#eip-7594-c .4844-box')
      .find('p')
      .should('contain.text', text, { timeout: 25000 })
    text =
      '0x8d90ed38068f3561132d9264db8c8dfb5237af24a6e28c3d4e72d3ad8d51d97be5733ddc382c9718822cb29ccc26364e'
    cy.get('#eip-7594-c .7594-box')
      .find('p:first')
      .should('contain.text', text, { timeout: 25000 })
  })
})
