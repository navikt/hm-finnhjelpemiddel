import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AnimateLayout from '@/components/layout/AnimateLayout'

import DefinitionList from '@/components/definition-list/DefinitionList'
import { toValueAndUnit } from '@/utils/string-util'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { CopyButton, Heading, VStack } from '@navikt/ds-react'
import { headers } from 'next/headers'
import { Fragment } from 'react'
import AccessoriesAndSparePartsInfo from './AccessoriesAndSparePartsInfo'
import { AgreementInfo } from './AgreementInfo'
import InformationTabs, { InformationAccordion } from './InformationTabs'
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
      <VStack>
        <ProductPageTopInfo product={product} supplier={supplier} />
        <ProductPageTabs product={product} />
        {product.variantCount > 1 && (
          <section
            className="product-info__product-variants spacing-top--large"
            aria-label="Tabell med informasjon på tvers av produktvarianter som finnes"
          >
            <ProductVariants product={product} />
          </section>
        )}

        {product.variantCount === 1 && (
          <VStack className="spacing-top--large spacing-bottom--medium">
            <Heading level="2" size="medium" spacing>
              Egenskaper
            </Heading>

            <DefinitionList horizontal>
              <DefinitionList.Term>Artikkelnummer</DefinitionList.Term>
              <DefinitionList.Definition className="product-info__dd-supplier-ref">
                <CopyButton
                  size="small"
                  className="hms-copy-button"
                  copyText={product.variants[0].supplierRef}
                  text={product.variants[0].supplierRef}
                  activeText="Kopiert"
                  variant="action"
                  activeIcon={<ThumbUpIcon aria-hidden />}
                />
              </DefinitionList.Definition>
              {Object.entries(product.variants[0].techData).map(([key, value], i) => (
                <Fragment key={i}>
                  <DefinitionList.Term>{key}</DefinitionList.Term>
                  <DefinitionList.Definition>
                    {key !== undefined ? toValueAndUnit(value.value, value.unit) : '-'}
                  </DefinitionList.Definition>
                </Fragment>
              ))}
            </DefinitionList>
          </VStack>
        )}
        {productsOnPosts && productsOnPosts?.length > 0 && (
          <AgreementInfo product={product} productsOnPosts={productsOnPosts} />
        )}
        {/* TODO: Fjerne accessories && accessories.length > 0 slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}
        {accessories.length > 0 && <AccessoriesAndSparePartsInfo products={accessories} type={'Accessories'} />}
        {/* TODO: Fjerne spareParts && spareParts.length > 0 &&  slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}
        {accessories.length > 0 && <AccessoriesAndSparePartsInfo products={accessories} type={'Spare parts'} />}
      </VStack>
    </AnimateLayout>
  )
}

const ProductPageTabs = ({ product }: { product: Product }) => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobileDevice = /Mobile|webOS|Android|iOS|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent || '')

  return (
    <section
      className="product-info__tabs spacing-top--large"
      aria-label="Produktbeskrivelse og medfølgende dokumenter"
    >
      {isMobileDevice ? <InformationAccordion product={product} /> : <InformationTabs product={product} />}
    </section>
  )
}

export default ProductPage
