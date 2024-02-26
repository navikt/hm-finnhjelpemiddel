import Link from 'next/link'

import { AnimatePresence, Variants, motion } from 'framer-motion'

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button } from '@navikt/ds-react'

import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'

import classNames from 'classnames'
import ProductCard from '../ProductCard'

const productCardAnimations: Variants = {
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

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, resetProductToCompare } = useHydratedCompareStore()

  const toggleButtonText = `Produkter til sammenligning (${productsToCompare.length})`

  const reversedProductsToCompare = productsToCompare.slice().reverse()

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
                <AnimatePresence mode="popLayout">
                  {reversedProductsToCompare.map((product) => (
                    <motion.li
                      layout
                      key={'compare-' + product.id}
                      variants={productCardAnimations}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <ProductCard product={product} type="removable" />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              {productsToCompare.length > 1 && (
                <div className="compare-menu__buttons">
                  <Link href="/sammenlign" passHref legacyBehavior>
                    <Button as="a" icon={<ChevronRightIcon aria-hidden />} iconPosition="right">
                      Sammenlign
                    </Button>
                  </Link>
                  <Button
                    icon={<TrashIcon aria-hidden />}
                    onClick={() => {
                      resetProductToCompare(), setCompareMenuState(CompareMenuState.Minimized)
                    }}
                  >
                    Nullstill
                  </Button>
                </div>
              )}
              {productsToCompare.length === 1 && (
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

export default CompareMenu
