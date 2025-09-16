import { Product } from '@/utils/product-util'

import { BodyLong, Heading } from '@/components/aksel-client'
import { HStack, VStack } from '@navikt/ds-react'
import ProductTop from '@/app/produkt/[id]/ProductTop'
import { ProductPageLayout } from '@/app/produkt/ProductPageLayout'
import { ProductCardPart } from '@/app/produkt/ProductCardPart'

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
          Hjelpemidler {product.accessory ? 'tilbehøret' : 'reservedelen'} passer til
        </Heading>
        {matchingProducts && matchingProducts.length > 0 ? (
          <VStack gap={'4'}>
            <HStack gap="2" justify="start">
              {/*Her må det håndteres at et tilbehør kan ha flere avtaler*/}
              {matchingProducts.map((product, i) => (
                /*<ProductCard product={product} key={`${i}-${product.id}`} type="plain" />*/
                <ProductCardPart
                  product={product}
                  key={`${i}-${product.id}`}
                  variantCount={product.variantCount}
                  rank={product.agreements?.[0]?.rank}
                />
              ))}
            </HStack>
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
