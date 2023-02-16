import { Close, Picture, Expand, Collapse } from '@navikt/ds-icons'
import Image from 'next/image'
import { BodyShort, Button, LinkPanel } from '@navikt/ds-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Product } from '../../utils/product-util'
import { CompareMenuState, useHydratedCompareStore } from '../../utils/state-util'
import { useState } from 'react'

const container = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
      delayChildren: 0.3,
    },
  },
}

const listConatainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay: 0.2,
    },
  },
}

const listItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, removeProduct } = useHydratedCompareStore()

  const openView = (
    <AnimatePresence>
      <motion.div
        key="modal"
        layoutId="compare-menu"
        variants={container}
        initial={'hidden'}
        animate={'show'}
        className="products-to-compare products-to-compare__open"
      >
        <motion.button
          layoutId="chevron-button"
          onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
          className="products-to-compare__chevron-button"
        >
          <span className="navds-button__icon">
            <Expand title="Sjul sammenligning" />
          </span>
        </motion.button>
        <AnimatePresence>
          <motion.div
            variants={listConatainer}
            initial="hidden"
            animate="show"
            className="products-to-compare__products-container"
          >
            {productsToCompare.length === 0 && (
              <motion.div variants={listConatainer} initial="hidden" animate="show">
                <BodyShort>Ingen produkter er lagt til for sammenligning</BodyShort>
              </motion.div>
            )}
            {productsToCompare.length !== 0 && (
              <>
                {productsToCompare ? (
                  <motion.ul
                    variants={listConatainer}
                    initial="hidden"
                    animate="show"
                    className="products-to-compare__chosen-products"
                  >
                    {productsToCompare.map((product: Product) => (
                      <motion.li variants={listItem} key={'compare-' + product.id}>
                        <ChosenProductCard
                          product={product}
                          removeProduct={removeProduct}
                          key={'compare-' + product.id}
                        ></ChosenProductCard>
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : null}
                {productsToCompare.length > 1 && (
                  <LinkPanel href="/sammenlign" className="products-to-compare__link-panel" border>
                    <LinkPanel.Title>Sammenlign {productsToCompare.length} produkter</LinkPanel.Title>
                  </LinkPanel>
                )}
                {productsToCompare.length === 1 && (
                  <BodyShort style={{ maxWidth: '200px' }}>
                    Velg minst ett produkt til for å gå til sammenligning.
                  </BodyShort>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )

  const miniView = (
    <AnimatePresence>
      <motion.div
        layoutId="compare-menu"
        variants={container}
        initial={'hidden'}
        animate={'show'}
        className="products-to-compare minimized"
      >
        <motion.button
          layoutId="chevron-button"
          onClick={() => setCompareMenuState(CompareMenuState.Open)}
          className="products-to-compare__chevron-button"
        >
          <span className="navds-button__icon">
            <Collapse title="Åpne sammenligning" />
          </span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )

  return (
    <>
      {compareMenuState === CompareMenuState.Open && openView}
      {compareMenuState === CompareMenuState.Minimized && miniView}
    </>
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
    <div className="products-to-compare__product">
      <div className="products-to-compare__image">
        {!hasImage && (
          <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
        )}
        {hasImage && (
          <Image loader={imageLoader} src={firstImageSrc} alt="Produktbilde" width="0" height="0" sizes="100vw" />
        )}
      </div>
      <BodyShort size="small" className="products-to-compare__product-title">
        {product.hmsartNr ? product.title + ' (' + product.hmsartNr + ')' : product.title}
      </BodyShort>
      <Button
        className="products-to-compare__remove-product-button"
        size="small"
        variant="tertiary"
        onClick={() => removeProduct(product)}
        icon={<Close title="Fjern produkt fra sammenligning" />}
      />
    </div>
  )
}

export default CompareMenu
