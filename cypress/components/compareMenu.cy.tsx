import React from 'react'
import CompareMenu from 'src/components/compare-products/CompareMenu'

const openMenuSelector = '[data-cy="compare-menu-open"]'
const minimizedMenuSelector = '[data-cy="compare-menu-minimized"]'

describe('<CompareMenu />', () => {
  beforeEach(() => {
    cy.mount(<CompareMenu />)
    cy.injectAxe()
  })

  it('mounts open menu by default and has no detectable a11y violations', () => {
    cy.get(openMenuSelector)
    cy.checkA11y(openMenuSelector)
  })
})
