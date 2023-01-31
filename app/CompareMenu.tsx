import { Close, Picture, Expand, Collapse } from '@navikt/ds-icons'
import Image from 'next/image'
import { BodyShort, Button, LinkPanel } from '@navikt/ds-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Product } from '../utils/product-util'
import { CompareMenuState, useHydratedCompareStore } from '../utils/state-util'
import './search.scss'
import { useState } from 'react'

const CompareMenu = () => {
  const { compareMenuState, productsToCompare, setCompareMenuState, removeProduct } = useHydratedCompareStore()

  const ease = {
    duration: 0.4,
    ease: 'easeInOut',
  }

  const openView = (
    <motion.div
      key="modal"
      layoutId="compare-menu"
      transition={ease}
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
      <motion.div className="products-to-compare__products-container">
        {productsToCompare.length === 0 && <BodyShort>Ingen produkter er lagt til for sammenligning</BodyShort>}
        <>
          <div className="products-to-compare__chosen-products">
            {productsToCompare.map((product) => (
              <ChosenProductCard
                product={product}
                removeProduct={removeProduct}
                key={'compare-' + product.id}
              ></ChosenProductCard>
            ))}
          </div>
          {productsToCompare.length > 1 && (
            <LinkPanel href="/sammenlign" border>
              <LinkPanel.Title>Sammenlign {productsToCompare.length} produkter</LinkPanel.Title>
            </LinkPanel>
          )}
          {productsToCompare.length === 1 && (
            <BodyShort style={{ maxWidth: '200px' }}>Velg minst ett produkt til for å gå til sammenligning.</BodyShort>
          )}
        </>
      </motion.div>
    </motion.div>
  )

  const miniView = (
    <motion.div layoutId="compare-menu" transition={ease} className="products-to-compare minimized">
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
  )

  return (
    <AnimatePresence initial={false}>
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
    <div className="products-to-compare__product">
      <div className="products-to-compare__image">
        {!hasImage && (
          <Picture width={150} height="auto" style={{ background: 'white' }} aria-label="Ingen bilde tilgjengelig" />
        )}
        {hasImage && (
          <Image loader={imageLoader} src={firstImageSrc} alt="Produktbilde" width="0" height="0" sizes="100vw" />
        )}
      </div>
      <BodyShort>{product.hmsNr ? product.title + ' (' + product.hmsNr + ')' : product.title}</BodyShort>
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
