describe('Imprint Page', () => {
  beforeEach(() => {
    cy.visit('/imprint')
  })

  it('renders contact section', () => {
    cy.contains('h3', 'CONTACT')
    cy.contains('Holger Drewes')
  })

  it('renders acknowledgements', () => {
    cy.contains('h3', 'ACKNOWLEDGEMENTS')
    cy.contains('li', 'EthereumJS')
    cy.contains('li', 'Midjourney')
    cy.contains('li', 'Tailwind')
  })

  it('renders data privacy section', () => {
    cy.contains('h3', 'DATA')
    cy.contains('does not collect any personal data')
  })
})
