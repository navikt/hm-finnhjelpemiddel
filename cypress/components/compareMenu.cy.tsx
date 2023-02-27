import React from 'react'
import CompareMenu from 'src/components/compare-products/CompareMenu'

const openMenuSelector = '[data-cy="compare-menu-open"]'
const minimizedMenuSelector = '[data-cy="compare-menu-minimized"]'

describe('<CompareMenu />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CompareMenu />)
  })
})
