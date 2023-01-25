import { Close, Picture, Expand, Collapse } from '@navikt/ds-icons'
import Image from 'next/image'
import { BodyShort, Button, LinkPanel } from '@navikt/ds-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Product } from '../utils/product-util'
import { CompareMenuState, CompareMode, useHydratedCompareStore } from '../utils/state-util'
import './search.scss'

const CompareMenu = () => {
  const { compareMenuState, compareMode, productsToCompare, setCompareMenuState, removeProduct } =
    useHydratedCompareStore()
  const mode =
    compareMode === CompareMode.Deactivated
      ? 'deactivated'
      : compareMenuState === CompareMenuState.Open
      ? 'open'
      : 'minimized'

  const chevronButton =
    compareMenuState === CompareMenuState.Open ? (
      <motion.button
        layout
        onClick={() => setCompareMenuState(CompareMenuState.Minimized)}
        className="products-to-compare__chevron-button"
      >
        <span className="navds-button__icon">
          <Expand title="Sjul sammenligning" />
        </span>
      </motion.button>
    ) : (
      <motion.button
        layout
        onClick={() => setCompareMenuState(CompareMenuState.Open)}
        className="products-to-compare__chevron-button"
      >
        <span className="navds-button__icon">
          <Collapse title="Åpne sammenligning" />
        </span>
      </motion.button>
    )

  return (
    <>
      <AnimatePresence>
        {compareMode === CompareMode.Active && (
          <motion.div
            key="compare-menu"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 0.99, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut', when: 'afterChildren' }}
            className={'products-to-compare ' + 'products-to-compare__' + mode}
          >
            {chevronButton}
            {compareMenuState === CompareMenuState.Open && (
              <motion.div className={'products-to-compare__products-container'}>
                {productsToCompare.length > 1 && (
                  <>
                    <ChosenProducts productsToCompare={productsToCompare} removeProduct={removeProduct} />
                    <LinkPanel href="/sammenlign" border>
                      <LinkPanel.Title>Sammenlign {productsToCompare.length} produkter</LinkPanel.Title>
                    </LinkPanel>
                  </>
                )}
                {productsToCompare.length === 1 && (
                  <>
                    <ChosenProducts productsToCompare={productsToCompare} removeProduct={removeProduct} />
                    <BodyShort style={{ maxWidth: '200px' }}>
                      Velg minst ett produkt til for å gå til sammenligning.
                    </BodyShort>
                  </>
                )}
                {productsToCompare.length === 0 && <BodyShort>Ingen produkter er lagt til for sammenligning</BodyShort>}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const ChosenProducts = ({
  productsToCompare,
  removeProduct,
}: {
  productsToCompare: Product[]
  removeProduct: (product: Product) => void
}) => {
  return (
    <div className="products-to-compare__chosen-products">
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
              />
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
      ))}
    </div>
  )
}

export default CompareMenu
