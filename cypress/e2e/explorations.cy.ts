describe('EIP-7883 ModExp', () => {
  it('loads and displays exploration content', () => {
    cy.visit('/eip-7883-modexp-gas-cost-increase')
    cy.contains('h1', 'Feel Your Protocol')
    cy.contains('h3', 'ModExp')
    cy.get('#eip-7883-c', { timeout: 10000 }).should('exist')
  })

  it('loads default example with inputs', () => {
    cy.visit('/eip-7883-modexp-gas-cost-increase')
    cy.get('#eip-7883-c textarea', { timeout: 10000 }).should('not.have.value', '')
    cy.get('#eip-7883-c input').should('have.length.gte', 3)
  })

  it('example selector shows available options', () => {
    cy.visit('/eip-7883-modexp-gas-cost-increase')
    cy.get('#eip-7883-c .e-select', { timeout: 10000 }).click()
    cy.get('[role="option"]').should('have.length.gte', 2)
  })
})

describe('EIP-7594 PeerDAS', () => {
  it('loads and displays exploration content', () => {
    cy.visit('/eip-7594-peerdas-data-availability-sampling')
    cy.contains('h1', 'Feel Your Protocol')
    cy.contains('h3', 'Peer Data Availability Sampling')
    cy.get('#eip-7594-c', { timeout: 10000 }).should('exist')
  })

  it('loads default example with blob data', () => {
    cy.visit('/eip-7594-peerdas-data-availability-sampling')
    cy.get('#eip-7594-c textarea', { timeout: 10000 }).should('not.have.value', '')
  })

  it('example selector shows available options', () => {
    cy.visit('/eip-7594-peerdas-data-availability-sampling')
    cy.get('#eip-7594-c .e-select', { timeout: 10000 }).click()
    cy.get('[role="option"]').should('have.length.gte', 2)
  })
})

describe('EIP-7951 secp256r1', () => {
  it('loads and displays exploration content', () => {
    cy.visit('/eip-7951-secp256r1-precompile')
    cy.contains('h1', 'Feel Your Protocol')
    cy.contains('h3', 'secp256r1 Precompile Support')
    cy.get('#eip-7951-c', { timeout: 10000 }).should('exist')
  })

  it('loads default example with inputs', () => {
    cy.visit('/eip-7951-secp256r1-precompile')
    cy.get('#eip-7951-c textarea', { timeout: 10000 }).should('not.have.value', '')
    cy.get('#eip-7951-c input').should('have.length.gte', 5)
  })

  it('example selector shows available options', () => {
    cy.visit('/eip-7951-secp256r1-precompile')
    cy.get('#eip-7951-c .e-select', { timeout: 10000 }).click()
    cy.get('[role="option"]').should('have.length.gte', 2)
  })
})
