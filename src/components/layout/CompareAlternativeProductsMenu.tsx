import Link from 'next/link'

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button } from '@navikt/ds-react'

import classNames from 'classnames'
import {
  CompareAlternativesMenuState,
  useHydratedAlternativeProductsCompareStore,
} from '@/utils/compare-alternatives-state-util'
import RemovableAlternativeProductCardMenu from '@/components/RemovableAlternativeProductCardMenu'

const CompareAlternativeProductsMenu = () => {
  const {
    compareAlternativesMenuState,
    alternativeProductsToCompare,
    setCompareAlternativesMenuState,
    resetAlternativeProductToCompare,
  } = useHydratedAlternativeProductsCompareStore()

  const toggleButtonText = `Produkter til sammenligning (${alternativeProductsToCompare.length})`

  const reversedAlternativeProductsToCompare = alternativeProductsToCompare.slice().reverse()

  if (alternativeProductsToCompare.length == 0) {
    return <></>
  }

  return (
    <div
      className={classNames('compare-menu', {
        open: compareAlternativesMenuState === CompareAlternativesMenuState.Open,
        close: compareAlternativesMenuState === CompareAlternativesMenuState.Minimized,
      })}
    >
      {compareAlternativesMenuState === CompareAlternativesMenuState.Open ? (
        <Button
          className="compare-menu__chevron-button"
          variant="tertiary"
          iconPosition="right"
          icon={<ChevronDownIcon aria-hidden />}
          onClick={() => setCompareAlternativesMenuState(CompareAlternativesMenuState.Minimized)}
        >
          {toggleButtonText}
        </Button>
      ) : (
        <Button
          className="compare-menu__chevron-button"
          iconPosition="right"
          variant="tertiary"
          icon={<ChevronUpIcon aria-hidden />}
          onClick={() => setCompareAlternativesMenuState(CompareAlternativesMenuState.Open)}
        >
          {toggleButtonText}
        </Button>
      )}

      {compareAlternativesMenuState === CompareAlternativesMenuState.Open && (
        <div key="content" className="compare-menu__container">
          {alternativeProductsToCompare.length === 0 && (
            <div className="compare-menu__placeholder compare-menu__placeholder__empty">
              <BodyShort>Ingen produkter er lagt til for sammenligning.</BodyShort>
            </div>
          )}
          {alternativeProductsToCompare.length !== 0 && (
            <>
              <ul className="compare-menu__chosen-products">
                {reversedAlternativeProductsToCompare.map((product) => (
                  <li key={'compare-' + product.id}>
                    <RemovableAlternativeProductCardMenu product={product} />
                  </li>
                ))}
              </ul>

              {alternativeProductsToCompare.length > 1 && (
                <div className="compare-menu__buttons">
                  <Link href="/sammenlign-alternativer" passHref legacyBehavior>
                    <Button as="a" icon={<ChevronRightIcon aria-hidden />} iconPosition="right">
                      Sammenlign
                    </Button>
                  </Link>
                  <Button
                    variant="tertiary"
                    icon={<TrashIcon aria-hidden />}
                    onClick={() => {
                      resetAlternativeProductToCompare()
                      setCompareAlternativesMenuState(CompareAlternativesMenuState.Minimized)
                    }}
                  >
                    Nullstill
                  </Button>
                </div>
              )}
              {alternativeProductsToCompare.length === 1 && (
                <div className="compare-menu__placeholder compare-menu__placeholder__one-more">
                  <BodyShort>Velg minst ett produkt til for å gå til sammenligning.</BodyShort>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default CompareAlternativeProductsMenu
