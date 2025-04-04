import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import { BodyLong, Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import ProductCard from '@/components/ProductCard'
import { Bleed } from '@navikt/ds-react'
import ProductPageTopInfo from './ProductPageTopInfo'
import './product-page.scss'

type Props = {
  product: Product
  supplier: Supplier
  matchingProducts: Product[] | null
}

const AccessoryOrSparePartPage = ({ product, supplier, matchingProducts }: Props) => {
  return (
    <>
      <AnimateLayout>
        <article className="spacing-top--large spacing-bottom--large">
          <ProductPageTopInfo product={product} supplier={supplier} />
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
        </article>
      </AnimateLayout>
    </>
  )
}

export default AccessoryOrSparePartPage
