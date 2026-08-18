import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button } from '@navikt/ds-react'

import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'

import classNames from 'classnames'
import ProductCardCompare from '@/components/ProductCardCompare'
import NextLink from 'next/link'
import { useEffect } from 'react'

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, resetProductToCompare } = useHydratedCompareStore()

  const toggleButtonText = `Produkter til sammenligning (${productsToCompare.length})`

  const reversedProductsToCompare = productsToCompare.slice().reverse()

  useEffect(() => {
    if (productsToCompare.length === 2) {
      setCompareMenuState(CompareMenuState.Open)
      console.log(productsToCompare)
    }
    if (productsToCompare.length === 1) {
      setCompareMenuState(CompareMenuState.Minimized)
    }
  }, [productsToCompare.length])

  if (productsToCompare.length === 0) {
    return <></>
  }

  const compareUrl = `/sammenlign?${reversedProductsToCompare.map((p) => `id=${p.id}`).join('&')}`

  return (
    <div
      className={classNames('compare-menu', {
        open: compareMenuState === CompareMenuState.Open,
        close: compareMenuState === CompareMenuState.Minimized,
      })}
    >
      {compareMenuState === CompareMenuState.Open ? (
        <Button
          className="compare-menu__chevron-button"
          variant="tertiary"
          iconPosition="right"
          icon={<ChevronDownIcon aria-hidden />}
          onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
        >
          {toggleButtonText}
        </Button>
      ) : (
        <Button
          className="compare-menu__chevron-button"
          iconPosition="right"
          variant="tertiary"
          icon={<ChevronUpIcon aria-hidden />}
          onClick={() => setCompareMenuState(CompareMenuState.Open)}
        >
          {toggleButtonText}
        </Button>
      )}

      {compareMenuState === CompareMenuState.Open && (
        <div key="content" className="compare-menu__container">
          <ul className="compare-menu__chosen-products">
            {reversedProductsToCompare.map((product) => (
              <li key={'compare-' + product.id}>
                <ProductCardCompare product={product} type="removable" />
              </li>
            ))}
          </ul>
          {productsToCompare.length >= 2 ? (
            <div className="compare-menu__buttons">
              <NextLink href={compareUrl} passHref>
                <Button as="a" icon={<ChevronRightIcon aria-hidden />} iconPosition="right">
                  Sammenlign
                </Button>
              </NextLink>
              <Button
                variant="tertiary"
                icon={<TrashIcon aria-hidden />}
                onClick={() => {
                  resetProductToCompare()
                  setCompareMenuState(CompareMenuState.Minimized)
                }}
              >
                Nullstill
              </Button>
            </div>
          ) : (
            <div className="compare-menu__placeholder compare-menu__placeholder__one-more">
              <BodyShort>Velg minst ett produkt til for å gå til sammenligning.</BodyShort>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CompareMenu
