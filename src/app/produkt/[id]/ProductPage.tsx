import { Product } from '@/utils/product-util'
import { toValueAndUnit } from '@/utils/string-util'
import { Supplier } from '@/utils/supplier-util'

import { Heading } from '@/components/aksel-client'
import DefinitionList from '@/components/definition-list/DefinitionList'
import AnimateLayout from '@/components/layout/AnimateLayout'

import { VStack } from '@navikt/ds-react'
import { Fragment } from 'react'
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
    <>
      <AnimateLayout>
        <article className="product-info spacing-top--large">
          <VStack gap={{ xs: '4', lg: '10' }} className="spacing-bottom--large">
            <ProductPageTopInfo product={product} supplier={supplier} />
            <section aria-label="Produktegenskaper som alle produktvariantene har til felles">
              <Heading level="2" size="medium" spacing>
                Produktegenskaper
              </Heading>
              <Characteristics product={product} />
            </section>
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
        </article>
      </AnimateLayout>
    </>
  )
}

export default ProductPage

const Characteristics = ({ product }: { product: Product }) => {
  const common = product.attributes?.commonCharacteristics
  return (
    <DefinitionList>
      {product.variantCount === 1 && product.variants[0] && (
        <>
          <DefinitionList.Term>HMS-nummer</DefinitionList.Term>
          <DefinitionList.Definition>
            {product.variants[0].hmsArtNr !== null ? product.variants[0].hmsArtNr : '-'}
          </DefinitionList.Definition>
          <DefinitionList.Term>Lev-artnr</DefinitionList.Term>
          <DefinitionList.Definition>{product.variants[0].supplierRef}</DefinitionList.Definition>
        </>
      )}
      <DefinitionList.Term>ISO-kategori (kode)</DefinitionList.Term>
      <DefinitionList.Definition>
        {product.isoCategoryTitle + '(' + product.isoCategory + ')'}
      </DefinitionList.Definition>
      {common &&
        Object.keys(common).map((key, i) => (
          <Fragment key={i}>
            <DefinitionList.Term>{key}</DefinitionList.Term>
            <DefinitionList.Definition>
              {common[key] !== undefined ? toValueAndUnit(common[key].value, common[key].unit) : '-'}
            </DefinitionList.Definition>
          </Fragment>
        ))}
    </DefinitionList>
  )
}
