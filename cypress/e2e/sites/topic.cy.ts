describe('Topic Page (Fusaka)', () => {
  beforeEach(() => {
    cy.visit('/fusaka')
  })

  it('renders topic title and external link', () => {
    cy.contains('Fusaka')
    cy.get('a[href="https://forkcast.org/upgrade/fusaka"]').should('exist')
  })

  it('displays all topic EIP widgets', () => {
    cy.get('#eip-7883-precompile-c', { timeout: 10000 }).should('exist')
    cy.get('#eip-7594-precompile-c', { timeout: 10000 }).should('exist')
    cy.get('#eip-7951-precompile-c', { timeout: 10000 }).should('exist')
  })

  it('EIP widgets show titles', () => {
    cy.get('#eip-7883-precompile-c').contains('h3', 'ModExp')
    cy.get('#eip-7951-precompile-c').contains('h3', 'secp256r1')
    cy.get('#eip-7594-precompile-c').contains('h3', 'Peer Data')
  })

  it('EIP widgets have EIP links', () => {
    cy.get('#eip-7883-precompile-c .visit-eip-button')
      .should('have.attr', 'href')
      .and('include', 'eip-7883')
    cy.get('#eip-7951-precompile-c .visit-eip-button')
      .should('have.attr', 'href')
      .and('include', 'eip-7951')
  })

  it('renders dancer image', () => {
    cy.get('img').should('exist')
  })
})
