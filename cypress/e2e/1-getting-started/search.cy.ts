describe('Ally', () => {
  it('home page is accessible', () => {
    cy.visit('http://localhost:3000/?agreement=true')
    cy.injectAxe()
    cy.checkA11y()
  })
})
