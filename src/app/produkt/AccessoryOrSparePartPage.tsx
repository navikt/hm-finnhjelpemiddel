import { Product } from '@/utils/product-util'

import { BodyLong, Heading } from '@/components/aksel-client'

import ProductCard from '@/components/ProductCard'
import { VStack } from '@navikt/ds-react'
import 'src/app/produkt/product-page.scss'
import ProductTop from '@/app/produkt/[id]/ProductTop'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'

type Props = {
  product: Product
  matchingProducts: Product[] | null
}

const AccessoryOrSparePartPage = ({ product, matchingProducts }: Props) => {
  return (
    <ProductPageLayout>
      <ProductTop product={product} />
      <VStack>
        <Heading level="2" size="medium" spacing>
          Produkter {product.accessory ? 'tilbehøret' : 'reservedelen'} passer til
        </Heading>
        {matchingProducts && matchingProducts.length > 0 ? (
          <VStack gap={'4'}>
            {/*Her må det håndteres at et tilbehør kan ha flere avtaler*/}
            {matchingProducts.map((product, i) => (
              <ProductCard product={product} key={`${i}-${product.id}`} type="plain" />
            ))}
          </VStack>
        ) : (
          <BodyLong>
            Det er ikke oppgitt hvilke produkter som passer til
            {product.accessory ? ' tilbehøret' : ' reservedelen'}
          </BodyLong>
        )}
      </VStack>
    </ProductPageLayout>
  )
}

export default AccessoryOrSparePartPage
