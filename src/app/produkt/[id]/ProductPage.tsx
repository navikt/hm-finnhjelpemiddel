import { Document, Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import File from '@/components/File'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { titleCapitalized } from '@/utils/string-util'
import { Bleed, BodyShort, Button, HGrid, HStack, Heading } from '@navikt/ds-react'
import NextLink from 'next/link'
import AccessoriesAndSparePartsInfo from './AccessoriesAndSparePartsInfo'
import { AgreementInfo } from './AgreementInfo'
import HmsSuggestion from './HmsSuggestion'
import ProductInformation from './ProductInformation'
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
          isOnAgreement={isOnAgreement}
          hasAccessories={hasAccessories}
          hasSpareParts={hasSpareParts}
        />

        <HStack justify="space-between">
          <section
            id="informasjonWrapper"
            className="product-page__tabs spacing-top--xlarge"
            aria-label="Beskrivelse og annen generell informasjon"
          >
            <span id="informasjon" />
            <ProductInformation product={product} />
          </section>

          {showHMSSuggestion && (
            <aside className="spacing-top--large">
              <HmsSuggestion product={product} />
            </aside>
          )}
        </HStack>

        <section
          id="egenskaperWrapper"
          className="product-page__product-variants spacing-vertical--xlarge"
          aria-label="Tabell med egenskaper på tvers av varianter som finnes"
        >
          <span id="egenskaper" />
          <ProductVariants product={product} />
        </section>

        <section aria-label="Videolenker" id="videoerWrapper" className="spacing-vertical--xlarge">
          <span id="videoer" />
          <Heading level="3" size="large" spacing>
            Video
          </Heading>
          <Videos videos={product.videos} />
        </section>

        <section aria-label="Videolenker" id="dokumenterWrapper" className="spacing-vertical--xlarge">
          <span id="dokumenter" />
          <Heading level="3" size="large" spacing>
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
              <span id="agreement-info"></span>
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
              <span id="accessories" />
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
              <span id="spareparts" />
              <AccessoriesAndSparePartsInfo products={accessories} type={'Spare parts'} />
            </section>
          </Bleed>
        )}
      </div>
    </AnimateLayout>
  )
}

const ProductNavigationBar = ({
  isOnAgreement,
  hasAccessories,
  hasSpareParts,
}: {
  isOnAgreement: boolean
  hasAccessories: boolean
  hasSpareParts: boolean
}) => {
  const bools = [isOnAgreement, hasAccessories, hasSpareParts]
  const numberOfColumns = bools.reduce((acc, bool) => acc + (bool ? 1 : 0), 4)
  return (
    <HGrid
      className="product-page__nav spacing-top--large"
      columns={{ sm: 'repeat(1, minmax(0, 300px))', md: numberOfColumns }}
      gap={{ xs: '2', lg: '7' }}
    >
      <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#informasjon">
        Generell informasjon
      </Button>
      {/* <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#varianter">
            Finn HMS-nummer
          </Button> */}

      <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#egenskaper">
        Egenskaper
      </Button>

      <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#videoer">
        Video
      </Button>

      <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#dokumenter">
        Dokumenter
      </Button>

      {isOnAgreement && (
        <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#agreement-info">
          Avtale med NAV
        </Button>
      )}

      {hasAccessories && (
        <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#tilbehør">
          Tilbehør
        </Button>
      )}

      {hasSpareParts && (
        <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#reservedeler">
          Reservedeler
        </Button>
      )}
    </HGrid>
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
