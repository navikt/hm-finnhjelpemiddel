import Link from 'next/link'

import { AnimatePresence, Variants, motion } from 'framer-motion'

import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'
import { Product } from '@/utils/product-util'

import ProductCard from '@/components/ProductCard'

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      duration: 0.3,
      delayChildren: 0.1,
    },
  },
}

const childVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
}

const productVariants: Variants = {
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
      type: 'spring',
    },
  },
}

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, removeProduct, resetProductToCompare } =
    useHydratedCompareStore()

  const MotionButton = motion(Button)
  const toggleButtonText = `Produkter til sammenligning (${productsToCompare.length})`

  const openView = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      layoutId="compare-menu"
      className="compare-menu compare-menu--open"
    >
      <MotionButton
        className="compare-menu__chevron-button"
        layoutId="chevron-button"
        variant="tertiary"
        iconPosition="right"
        icon={<ChevronDownIcon aria-hidden />}
        onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
      >
        {toggleButtonText}
      </MotionButton>

      <motion.div key="content" variants={childVariants} className="compare-menu__container">
        {productsToCompare.length === 0 && (
          <motion.div layoutId="placeholder" className="compare-menu__placeholder compare-menu__placeholder__empty">
            <motion.p layout="position">Ingen produkter er lagt til for sammenligning.</motion.p>
          </motion.div>
        )}
        {productsToCompare.length !== 0 && (
          <>
            {productsToCompare && (
              <motion.ul className="compare-menu__chosen-products">
                <AnimatePresence mode="popLayout">
                  {productsToCompare.map((product: Product, index: number, array: Product[]) => (
                    <motion.li
                      layout
                      key={'compare-' + array[array.length - 1 - index].id}
                      variants={productVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <ProductCard
                        key={'compare-' + array[array.length - 1 - index].id}
                        product={array[array.length - 1 - index]}
                        removeProduct={removeProduct}
                      ></ProductCard>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
            {productsToCompare.length > 1 && (
              <motion.div className="compare-menu__buttons">
                <Link href="/sammenlign" passHref legacyBehavior>
                  <Button as="a" icon={<ChevronRightIcon aria-hidden />} iconPosition="right">
                    Sammenlign
                  </Button>
                </Link>
                <MotionButton
                  variant="secondary"
                  icon={<TrashIcon aria-hidden />}
                  onClick={() => resetProductToCompare()}
                >
                  Nullstill
                </MotionButton>
              </motion.div>
            )}
            {productsToCompare.length === 1 && (
              <motion.div
                layoutId="placeholder"
                className="compare-menu__placeholder compare-menu__placeholder__one-more"
              >
                <motion.p layout="position">Velg minst ett produkt til for å gå til sammenligning.</motion.p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </motion.div>
  )

  const miniView = (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      layoutId="compare-menu"
      className="compare-menu"
    >
      <MotionButton
        className="compare-menu__chevron-button"
        layoutId="chevron-button"
        variant="tertiary"
        iconPosition="right"
        icon={<ChevronUpIcon aria-hidden />}
        onClick={() => setCompareMenuState(CompareMenuState.Open)}
      >
        {toggleButtonText}
      </MotionButton>
    </motion.div>
  )

  return (
    <AnimatePresence>
      {compareMenuState === CompareMenuState.Open && openView}
      {compareMenuState === CompareMenuState.Minimized && miniView}
    </AnimatePresence>
  )
}

export default CompareMenu
