import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AnimateLayout from '@/components/layout/AnimateLayout'

import { VStack } from '@navikt/ds-react'
import AccessoriesAndSparePartsInfo from './AccessoriesAndSparePartsInfo'
import { AgreementInfo } from './AgreementInfo'
import ProductPageTopInfo from './ProductPageTopInfo'
import ProductVariants from './ProductVariants'
import { ProductsOnPost } from './page'

type ProductProps = {
  product: Product
  supplier: Supplier
  accessories: Product[]
  spareParts: Product[]
  productsOnPosts?: ProductsOnPost[]
}

const ProductPage = ({ product, supplier, accessories, spareParts, productsOnPosts }: ProductProps) => {
  return (
    <AnimateLayout>
      <VStack gap={{ xs: '4', lg: '10' }} className="spacing-bottom--large">
        <ProductPageTopInfo product={product} supplier={supplier} />

        {product.variantCount > 1 && (
          <section
            className="product-info__product-variants"
            aria-label="Tabell med informasjon på tvers av produktvarianter som finnes"
          >
            <ProductVariants product={product} />
          </section>
        )}
      </VStack>
      {productsOnPosts && productsOnPosts?.length > 0 && (
        <AgreementInfo product={product} productsOnPosts={productsOnPosts} />
      )}
      {/* TODO: Fjerne accessories && accessories.length > 0 slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}
      {accessories.length > 0 && <AccessoriesAndSparePartsInfo products={accessories} type={'Accessories'} />}
      {/* TODO: Fjerne spareParts && spareParts.length > 0 &&  slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}
      {accessories.length > 0 && <AccessoriesAndSparePartsInfo products={accessories} type={'Spare parts'} />}
    </AnimateLayout>
  )
}

export default ProductPage
