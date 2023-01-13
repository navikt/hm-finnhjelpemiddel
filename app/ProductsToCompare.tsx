import { Close, Picture, Expand, Collapse } from '@navikt/ds-icons'
import Image from 'next/image'
import { Heading, BodyShort, Button } from '@navikt/ds-react'
import { motion } from 'framer-motion'
import { Product } from '../utils/product-util'
import { CompareMenuState, CompareMode, useHydratedPCStore } from '../utils/state-util'
import './search.scss'

const variantsCompareMenu = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      restDelta: 2,
    },
  },
  minimized: {
    opacity: 1,
    y: '90%',
    delay: 0.5,
    type: 'spring',
    stiffness: 400,
    damping: 40,
  },
  deactivated: {
    opacity: 0,
    y: '100%',
    delay: 0.5,
    type: 'spring',
    stiffness: 400,
    damping: 40,
  },
}

const ProductsToCompare = () => {
  const { compareMenuState, compareMode, productsToCompare, setCompareMenuState, removeProduct } = useHydratedPCStore()
  const asd =
    compareMode === CompareMode.Deactivated
      ? 'deactivated'
      : compareMenuState === CompareMenuState.Open
      ? 'open'
      : 'minimized'

  const chevronButton =
    compareMenuState === CompareMenuState.Open ? (
      <Button
        className="products-to-compare__minimize-button"
        size="small"
        variant="tertiary"
        onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
        icon={<Expand title="Sjul sammenlikning" />}
      />
    ) : (
      <Button
        className="products-to-compare__minimize-button"
        size="small"
        variant="tertiary"
        onClick={() => setCompareMenuState(CompareMenuState.Open)}
        icon={<Collapse title="Åpne sammenlikning" />}
      />
    )

  return (
    <motion.div animate={asd} variants={variantsCompareMenu} className="products-to-compare">
      <div className="products-to-compare__container">
        {compareMenuState === CompareMenuState.Open && (
          <>
            <Heading level="2" size="medium">
              Sammenlikn følgende produkter
            </Heading>

            {productsToCompare.length > 0 && (
              <ChosenProducts productsToCompare={productsToCompare} removeProduct={removeProduct} />
            )}
            {productsToCompare.length === 0 && <BodyShort>Ingen produkter er lagt til</BodyShort>}
          </>
        )}
        {chevronButton}
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
