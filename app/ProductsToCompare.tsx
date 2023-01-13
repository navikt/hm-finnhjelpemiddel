import { Close, Picture } from '@navikt/ds-icons'
import Image from 'next/image'
import { Heading, BodyShort, Button } from '@navikt/ds-react'
import { motion } from 'framer-motion'
import { Product } from '../utils/product-util'
import { useHydratedPCStore } from '../utils/state-util'
import './search.scss'

const variantsComparingSummary = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      restDelta: 2,
    },
  },
  closed: {
    opacity: 0.5,
    y: '100%',
    delay: 0.5,
    type: 'spring',
    stiffness: 400,
    damping: 40,
  },
}

const ProductsToCompare = () => {
  const { showProductsToCompare, productsToCompare, toggleShowProductsToCompare, removeProduct } = useHydratedPCStore()

  return (
    <motion.div
      animate={showProductsToCompare ? 'open' : 'closed'}
      variants={variantsComparingSummary}
      className="products-to-compare"
    >
      <div className="products-to-compare__container">
        <Heading level="2" size="medium">
          Sammenlikn følgende produkter
        </Heading>

        {productsToCompare.length > 0 && (
          <ChosenProducts productsToCompare={productsToCompare} removeProduct={removeProduct} />
        )}
        {productsToCompare.length === 0 && <BodyShort>Ingen produkter er lagt til</BodyShort>}

        <Button
          className="products-to-compare__minimize-button"
          size="small"
          variant="tertiary"
          onClick={toggleShowProductsToCompare}
          icon={<Close title="Lukk sammenlikning" />}
        />
      </div>
    </motion.div>
  )
}

const ChosenProducts = ({
  productsToCompare,
  removeProduct,
}: {
  productsToCompare: Product[]
  removeProduct: (product: Product) => void
}) => {
  console.log(productsToCompare)
  return (
    <>
      {productsToCompare.map((product) => (
        <div className="products-to-compare__product" key={'compare-' + product.id}>
          <div className="products-to-compare__image">
            {product.photos.length === 0 && (
              <Picture
                width={150}
                height="auto"
                style={{ background: 'white' }}
                aria-label="Ingen bilde tilgjengelig"
              />
            )}
            {product.photos.length !== 0 && (
              <Image
                src={`https://www.hjelpemiddeldatabasen.no/blobs/orig/${product.photos.at(0)?.uri}`}
                alt="Produktbilde"
                width="0"
                height="0"
                sizes="100vw"
                style={{}}
              />
            )}
          </div>
          <BodyShort>{product.hmsNr ? product.title + '(' + product.hmsNr + ')' : product.title}</BodyShort>
          <Button
            className="products-to-compare__remove-product-button"
            size="small"
            variant="tertiary"
            onClick={() => removeProduct(product)}
            icon={<Close title="Fjern produkt fra sammenlikning" />}
          />
        </div>
      ))}
    </>
  )
}

export default ProductsToCompare
