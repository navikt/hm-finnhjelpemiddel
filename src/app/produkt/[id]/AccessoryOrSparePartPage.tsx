import { Agreement } from '@/utils/agreement-util'
import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import { BackButton } from '@/components/BackButton'
import ProductCard from '@/components/ProductCard'
import { BodyLong, Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import ProductPageTopInfo from './ProductPageTopInfo'

type Props = {
  product: Product
  agreement: Agreement | null
  supplier: Supplier
  matchingProducts: Product[] | null
}

const AccessoryOrSparePartPage = ({ product, agreement, supplier, matchingProducts }: Props) => {
  return (
    <>
      <BackButton />
      <AnimateLayout>
        <article className="product-info">
          <ProductPageTopInfo product={product} supplier={supplier} agreement={agreement} />
          <section className="accessory-spare-part-section">
            <div className="max-width">
              <Heading level="2" size="medium" spacing>
                Produkter {product.accessory ? 'tilbehøret' : 'reservedelen'} passer til
              </Heading>
              {matchingProducts && matchingProducts.length > 0 ? (
                <div className="accessory-spare-part-section__card-container">
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
            </div>
          </section>
        </article>
      </AnimateLayout>
    </>
  )
}

export default AccessoryOrSparePartPage
