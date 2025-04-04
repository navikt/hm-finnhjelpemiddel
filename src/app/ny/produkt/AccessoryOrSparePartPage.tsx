import { Product } from '@/utils/product-util'

import { BodyLong, Heading } from '@/components/aksel-client'

import ProductCard from '@/components/ProductCard'
import { Bleed, VStack } from '@navikt/ds-react'
import 'src/app/produkt/product-page.scss'
import styles from '@/app/ny/produkt/[id]/ProductPage.module.scss'
import ProductTop from '@/app/ny/produkt/[id]/ProductTop'

type Props = {
  product: Product
  matchingProducts: Product[] | null
}

const AccessoryOrSparePartPage = ({ product, matchingProducts }: Props) => {
  return (
    <div className={styles.container}>
      <VStack gap={'14'} paddingBlock={'16'} maxWidth={'1200px'}>
        <ProductTop product={product} />
        <Bleed marginInline="full" asChild>
          <section className="product-page-section__container product-page-section__blue-background">
            <div className="product-page-section__content main-wrapper--large">
              <Heading level="2" size="medium" spacing>
                Produkter {product.accessory ? 'tilbehøret' : 'reservedelen'} passer til
              </Heading>
              {matchingProducts && matchingProducts.length > 0 ? (
                <div className="product-page-section__card-container">
                  {/*Her må det håndteres at et tilbehør kan ha flere avtaler*/}
                  {matchingProducts.map((product, i) => (
                    <ProductCard product={product} key={`${i}-${product.id}`} type="plain" />
                  ))}
                </div>
              ) : (
                <BodyLong>
                  Det er ikke oppgitt hvilke produkter som passer til
                  {product.accessory ? ' tilbehøret' : ' reservedelen'}
                </BodyLong>
              )}
            </div>
          </section>
        </Bleed>
      </VStack>
    </div>
  )
}

export default AccessoryOrSparePartPage
