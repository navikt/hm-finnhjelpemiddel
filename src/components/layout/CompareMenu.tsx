'use client'

import { ALL_VARIANTS, selectionsToSearchParams } from '@/app/sammenlign/compare-columns'

import NextLink from 'next/link'

import classNames from 'classnames'

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Detail, VStack } from '@navikt/ds-react'

import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'

import ProductCardCompare from '@/components/ProductCardCompare'

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, resetProductToCompare, variantSelections } =
    useHydratedCompareStore()

  const toggleButtonText = `Produkter til sammenligning (${productsToCompare.length})`

  const reversedProductsToCompare = productsToCompare.slice().reverse()

  if (productsToCompare.length == 0) {
    return <></>
  }

  const compareUrl = `/sammenlign?${selectionsToSearchParams(
    new URLSearchParams(),
    reversedProductsToCompare.map((p) => p.id),
    variantSelections
  )}`

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
          {productsToCompare.length === 0 && (
            <div className="compare-menu__placeholder compare-menu__placeholder__empty">
              <BodyShort>Ingen produkter er lagt til for sammenligning.</BodyShort>
            </div>
          )}
          {productsToCompare.length !== 0 && (
            <>
              <ul className="compare-menu__chosen-products">
                {reversedProductsToCompare.map((product) => (
                  <li key={'compare-' + product.id}>
                    <VStack gap="space-4">
                      <ProductCardCompare product={product} type="removable" />
                      <SelectedVariantsText selections={variantSelections[product.id]} />
                    </VStack>
                  </li>
                ))}
              </ul>

              {productsToCompare.length > 0 && (
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
              )}
              {productsToCompare.length === 1 && (
                <div className="compare-menu__placeholder compare-menu__placeholder__one-more">
                  <BodyShort>Legg til flere produkter, eller sammenlign varianter av dette produktet.</BodyShort>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/** Kort tekst om valgte varianter. Ingenting vises når bare «Alle varianter» er valgt (standard). */
const SelectedVariantsText = ({ selections }: { selections: string[] | undefined }) => {
  if (!selections) return null
  const variantCount = selections.filter((selection) => selection !== ALL_VARIANTS).length
  if (variantCount === 0) return null

  const variantsText = variantCount === 1 ? '1 variant valgt' : `${variantCount} varianter valgt`
  return (
    <Detail textColor="subtle">
      {selections.includes(ALL_VARIANTS) ? `Alle varianter + ${variantsText}` : variantsText}
    </Detail>
  )
}

export default CompareMenu
