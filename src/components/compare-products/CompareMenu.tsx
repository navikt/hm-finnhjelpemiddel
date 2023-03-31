import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Collapse, Delete, Expand, Next } from '@navikt/ds-icons'
import { BodyShort, Button, Heading } from '@navikt/ds-react'
import { ImageIcon } from '@navikt/aksel-icons'
import { Product } from '../../utils/product-util'
import { CompareMenuState, useHydratedCompareStore } from '../../utils/compare-state-util'

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  show: {
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
  show: {
    opacity: 1,
    transition: {
      delay: 0.3,
    },
  },
}

const productVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, removeProduct } = useHydratedCompareStore()

  const MotionButton = motion(Button)

  const openView = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      layoutId="compare-menu"
      className="compare-menu compare-menu--open"
    >
      <MotionButton
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
            {productsToCompare ? (
              <motion.ul className="compare-menu__chosen-products">
                {productsToCompare.map((product: Product, index: number, array: Product[]) => (
                  <motion.li
                    key={'compare-' + array[array.length - 1 - index].id}
                    variants={productVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                  >
                    <ChosenProductCard
                      product={array[array.length - 1 - index]}
                      removeProduct={removeProduct}
                      key={'compare-' + array[array.length - 1 - index].id}
                    ></ChosenProductCard>
                  </motion.li>
                ))}
              </motion.ul>
            ) : null}
            {productsToCompare.length > 1 && (
              <motion.div>
                <Link href="/sammenlign" passHref>
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
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      layoutId="compare-menu"
      className="compare-menu"
    >
      <MotionButton
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

const ChosenProductCard = ({
  product,
  removeProduct,
}: {
  product: Product
  removeProduct: (product: Product) => void
}) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const imageLoader = ({ src }: { src: string }) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/snet/${src}`
  }

  return (
    <motion.div className="compare-menu__product">
      <div className="compare-menu__image">
        <div className="image">
          {!hasImage && (
            <ImageIcon
              width="100%"
              height="100%"
              style={{ background: 'white' }}
              aria-label="Ingen bilde tilgjengelig"
            />
          )}
          {hasImage && (
            <Image loader={imageLoader} src={firstImageSrc} alt="Produktbilde" fill style={{ objectFit: 'contain' }} />
          )}
        </div>
        <div className="overlay">
          <Button
            className="delete-product"
            onClick={() => removeProduct(product)}
            icon={<Delete title="Fjern produkt fra sammenligning" />}
          />
        </div>
      </div>
      <div className="compare-menu__info">
        <Heading size="xsmall" className="compare-menu__product-title">
          {product.title}
        </Heading>
        <div className="compare-menu__hms-nr">
          <BodyShort size="small">HMS-nr.</BodyShort>
          <BodyShort size="small">{product.hmsArtNr ? product.hmsArtNr : 'mangler'}</BodyShort>
        </div>
      </div>
    </motion.div>
  )
}

export default CompareMenu
