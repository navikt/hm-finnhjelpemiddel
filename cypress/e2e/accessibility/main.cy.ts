describe('Ally', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/?agreement=true')
    cy.injectAxe()
  })

  it('Search page is accessible', () => {
    cy.intercept('POST', '/products/_search*')
    cy.get('[data-cy=search-filters]').should('be.visible')
    cy.checkA11y()
  })
})
