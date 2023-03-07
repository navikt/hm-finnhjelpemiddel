import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { Picture, Expand, Collapse, Next, Delete } from '@navikt/ds-icons'
import { BodyShort, Button, Heading } from '@navikt/ds-react'
import { Product } from '../../utils/product-util'
import { CompareMenuState, useHydratedCompareStore } from '../../utils/compare-state-util'
import Link from 'next/link'

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

  const openView = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="hidden"
      layoutId="compare-menu"
      className="compare-menu compare-menu__open"
    >
      <motion.button
        layoutId="chevron-button"
        key="chevron"
        onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
        className="compare-menu__chevron-button"
      >
        <span className="navds-button__icon">
          <Expand title="Sjul sammenligning" />
        </span>
      </motion.button>
      <motion.div key="content" variants={childVariants} className="compare-menu__container">
        {productsToCompare.length === 0 && (
          <motion.div layoutId="placeholder" className="compare-menu__placeholder compare-menu__placeholder__empty">
            <motion.p layout="position">Ingen produkter er lagt til for sammenligning</motion.p>
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
      className="compare-menu minimized"
    >
      <motion.button
        layoutId="chevron-button"
        onClick={() => setCompareMenuState(CompareMenuState.Open)}
        className="compare-menu__chevron-button"
      >
        <span className="navds-button__icon">
          <Collapse title="Åpne sammenligning" />
        </span>
      </motion.button>
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
            <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
          )}
          {hasImage && (
            <Image loader={imageLoader} src={firstImageSrc} alt="Produktbilde" fill style={{ objectFit: 'contain' }} />
          )}{' '}
        </div>
        <div className="owerlay">
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
          <BodyShort size="small">Hms-nr.</BodyShort>
          <BodyShort size="small">{product.hmsArtNr ? product.hmsArtNr : 'mangler'}</BodyShort>
        </div>
      </div>
    </motion.div>
  )
}

export default CompareMenu
