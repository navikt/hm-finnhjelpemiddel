import { AgreementInfo, Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import ProductCard from '@/components/ProductCard'
import { BodyLong, Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

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
        <article className="product-info spacing-top--large">
          <ProductPageTopInfo product={product} supplier={supplier} />
          <section className="product-page-section__container product-page-section__blue-background">
            <Heading level="2" size="medium" spacing>
              Produkter {product.accessory ? 'tilbehøret' : 'reservedelen'} passer til
            </Heading>
            {matchingProducts && matchingProducts.length > 0 ? (
              <div className="product-page-section__card-container">
                {matchingProducts.map((product, i) => (
                  <ProductCard key={i} product={product} showRank={true} />
                ))}
              </div>
            ) : (
              <BodyLong>
                Det er ikke oppgitt hvilke produkter som passer til
                {product.accessory ? 'tilbehøret' : 'reservedelen'}
              </BodyLong>
            )}
          </section>
        </article>
      </AnimateLayout>
    </>
  )
}

export default AccessoryOrSparePartPage
