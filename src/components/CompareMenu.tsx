import Link from 'next/link'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Collapse, Expand, Next } from '@navikt/ds-icons'
import { Button } from '@navikt/ds-react'
import { Product } from '@/utils/product-util'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/compare-state-util'

import ProductCard from './ProductCard'

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
  const { compareMenuState, productsToCompare, setCompareMenuState, removeProduct } = useHydratedCompareStore()

  const MotionButton = motion(Button)

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
        icon={<Expand aria-hidden />}
        onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
      >
        Skjul sammenligner
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
              <motion.div>
                <Link href="/sammenlign" passHref legacyBehavior>
                  <Button as="a" icon={<Next aria-hidden />} iconPosition="right">
                    Sammenlign
                  </Button>
                </Link>
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
        icon={<Collapse aria-hidden />}
        onClick={() => setCompareMenuState(CompareMenuState.Open)}
      >
        Vis sammenligner
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
