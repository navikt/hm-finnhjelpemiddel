import { Document, Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import File from '@/components/File'
import DefinitionList from '@/components/definition-list/DefinitionList'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { titleCapitalized, toValueAndUnit } from '@/utils/string-util'
import { ThumbUpIcon } from '@navikt/aksel-icons'
import { Bleed, BodyShort, CopyButton, HStack, Heading, VStack } from '@navikt/ds-react'

import { Fragment } from 'react'
import AccessoriesAndSparePartsInfo from './AccessoriesAndSparePartsInfo'
import { AgreementInfo } from './AgreementInfo'
import HmsSuggestion from './HmsSuggestion'
import ProductInformation from './ProductInformation'
import ProductNavigationBar from './ProductNavigationBar'
import ProductPageTopInfo from './ProductPageTopInfo'
import ProductVariants from './ProductVariants'
import { Videos } from './Video'
import { ProductsOnPost } from './page'

type ProductProps = {
  product: Product
  supplier: Supplier
  accessories: Product[]
  spareParts: Product[]
  productsOnPosts?: ProductsOnPost[]
}

const ProductPage = ({ product, supplier, accessories, spareParts, productsOnPosts }: ProductProps) => {
  const isOnAgreement = product.agreements?.length > 0
  const hasAccessories = accessories.length > 0
  const hasSpareParts = spareParts.length > 0
  const showHMSSuggestion = product.isoCategory.startsWith('1222') && process.env.BUILD_ENV !== 'prod'

  return (
    <AnimateLayout>
      <div>
        <ProductPageTopInfo product={product} supplier={supplier} />
        <ProductNavigationBar
          hasVariants={product.variantCount > 1}
          isOnAgreement={isOnAgreement}
          hasAccessories={hasAccessories}
          hasSpareParts={hasSpareParts}
        />

        <HStack justify="space-between">
          <section
            id="informasjonWrapper"
            className="product-page__tabs spacing-top--large spacing-bottom--medium"
            aria-label="Beskrivelse og annen generell informasjon"
          >
            <span id="informasjon" tabIndex={-1} />
            <ProductInformation product={product} />
            {/* {isMobileDevice ? <InformationAccordion product={product} /> : <InformationTabs product={product} />} */}
          </section>

          {showHMSSuggestion && (
            <aside className="spacing-top--large">
              <HmsSuggestion product={product} />
            </aside>
          )}
        </HStack>

        {product.variantCount > 1 && (
          <section
            id="varianterWrapper"
            className="product-page__product-variants spacing-top--large spacing-bottom--medium"
            aria-label="Tabell med informasjon på tvers av varianter som finnes"
          >
            <span id="varianter" tabIndex={-1} />
            <ProductVariants product={product} />
          </section>
        )}

        {product.variantCount === 1 && (
          <VStack as="section" id="egenskaperWrapper" className="spacing-top--large spacing-bottom--medium">
            <span id="egenskaper" tabIndex={-1} />
            <Heading level="2" size="large" spacing>
              Egenskaper
            </Heading>

            <DefinitionList horizontal>
              <DefinitionList.Term>Lev-artnr</DefinitionList.Term>
              <DefinitionList.Definition className="product-page__dd-supplier-ref">
                <CopyButton
                  size="small"
                  className="hms-copy-button"
                  copyText={product.variants[0].supplierRef}
                  text={product.variants[0].supplierRef}
                  activeText="Kopiert"
                  variant="action"
                  activeIcon={<ThumbUpIcon aria-hidden />}
                  iconPosition="right"
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

        <section aria-label="Videolenker" id="videoerWrapper" className="spacing-top--large spacing-bottom--medium">
          <span id="videoer" tabIndex={-1} />
          <Heading level="3" size="large" spacing>
            Video
          </Heading>
          <Videos videos={product.videos} />
        </section>

        <section aria-label="Dokumenter" id="dokumenterWrapper" className="spacing-top--large spacing-bottom--large">
          <span id="dokumenter" />
          <Heading level="3" size="large" spacing tabIndex={-1}>
            Dokumenter
          </Heading>
          <Documents documents={product.documents} />
        </section>

        {productsOnPosts && productsOnPosts?.length > 0 && (
          <Bleed marginInline="full" asChild reflectivePadding>
            <section
              id="agreement-infoWrapper"
              className="product-page-bleed-section product-page-bleed-section__red spacing-top--small"
              aria-label="Informasjon om rammeavtalene hjelpemiddelet er på"
            >
              <span id="agreement-info" tabIndex={-1}></span>
              <AgreementInfo product={product} productsOnPosts={productsOnPosts} />
            </section>
          </Bleed>
        )}

        {/* TODO: Fjerne accessories && accessories.length > 0 slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}
        {hasAccessories && (
          <Bleed marginInline="full" asChild reflectivePadding>
            <section
              id="accessoriesWrapper"
              className="product-page-bleed-section product-page-bleed-section__yellow  spacing-top--small"
              aria-label="Tilbehør som passer til hjelpemiddelet"
            >
              <span id="accessories" tabIndex={-1} />
              <AccessoriesAndSparePartsInfo products={accessories} type={'Accessories'} />
            </section>
          </Bleed>
        )}
        {/* TODO: Fjerne spareParts && spareParts.length > 0 &&  slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}

        {hasSpareParts && (
          <Bleed marginInline="full" asChild reflectivePadding>
            <section
              id="sparepartsWrapper"
              className="product-page-bleed-section product-page-bleed-section__blue  spacing-top--small"
              aria-label="Reservedeler som passer til hjelpemiddelet"
            >
              <span id="spareparts" tabIndex={-1} />
              <AccessoriesAndSparePartsInfo products={accessories} type={'Spare parts'} />
            </section>
          </Bleed>
        )}
      </div>
    </AnimateLayout>
  )
}

export const Documents = ({ documents }: { documents: Document[] }) => {
  if (!documents.length) {
    return <BodyShort>Ingen dokumenter er lagt til av leverandør på dette hjelpemiddelet.</BodyShort>
  }

  return (
    <ul className="document-list">
      {documents.map((doc, index) => (
        <li key={index}>
          <File title={titleCapitalized(doc.title)} path={doc.uri} />
        </li>
      ))}
    </ul>
  )
}

export default ProductPage
