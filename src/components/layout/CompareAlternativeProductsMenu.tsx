import Link from 'next/link'

import { AnimatePresence, motion, Variants } from 'framer-motion'

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button } from '@navikt/ds-react'

import classNames from 'classnames'
import {
  CompareAlternativesMenuState,
  useHydratedAlternativeProductsCompareStore
} from "@/utils/compare-alternatives-state-util";
import RemovableAlternativeProductCardMenu from "@/components/RemovableAlternativeProductCardMenu";

const alternativeProductCardAnimations: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    transition: {
      duration: 0.1,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'ease',
    },
  },
}

const CompareAlternativeProductsMenu = () => {
  const {
    compareAlternativesMenuState,
    alternativeProductsToCompare,
    setCompareAlternativesMenuState,
    resetAlternativeProductToCompare
  } = useHydratedAlternativeProductsCompareStore()

  const toggleButtonText = `Produkter til sammenligning (${alternativeProductsToCompare.length})`

  const reversedAlternativeProductsToCompare = alternativeProductsToCompare.slice().reverse()

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
                <AnimatePresence mode="popLayout">
                  {reversedAlternativeProductsToCompare.map((product) => (
                    <motion.li
                      layout
                      key={'compare-' + product.id}
                      variants={alternativeProductCardAnimations}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <RemovableAlternativeProductCardMenu product={product} />
                    </motion.li>
                  ))}
                </AnimatePresence>
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
                      resetAlternativeProductToCompare(), setCompareAlternativesMenuState(CompareAlternativesMenuState.Minimized)
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
