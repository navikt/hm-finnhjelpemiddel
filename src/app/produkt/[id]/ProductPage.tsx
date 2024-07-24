import { Document, Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import File from '@/components/File'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { titleCapitalized } from '@/utils/string-util'
import { Bleed, BodyShort, Button, Heading, HGrid, HStack } from '@navikt/ds-react'
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
  const showHMSSuggestion = product.isoCategory.startsWith('1222')

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
            className="product-page__tabs spacing-top--xlarge"
            aria-label="Beskrivelse og annen generell informasjon"
          >
            <Heading level="2" size="large" spacing id="informasjon" tabIndex={-1}>
              Beskrivelse
            </Heading>
            <ProductInformation product={product} />
          </section>

          {showHMSSuggestion && (
            <aside className="spacing-top--large">
              <HmsSuggestion product={product} />
            </aside>
          )}
        </HStack>
        <section
          className="product-page__product-variants spacing-vertical--xlarge"
          aria-label="Tabell med egenskaper på tvers av varianter som finnes"
        >
          <Heading level="2" size="large" spacing id="egenskaper" tabIndex={-1}>
            Egenskaper
          </Heading>
          <ProductVariants product={product} />
        </section>

        <section aria-label="Videolenker" className="spacing-vertical--xlarge">
          <Heading level="2" size="large" spacing id="video" tabIndex={-1}>
            Video
          </Heading>
          <Videos videos={product.videos} />
        </section>

        <section aria-label="Videolenker" className="spacing-vertical--xlarge">
          <Heading level="2" size="large" spacing id="dokumenter" tabIndex={-1}>
            Dokumenter
          </Heading>
          <Documents documents={product.documents} />
        </section>

        {productsOnPosts && productsOnPosts?.length > 0 && (
          <Bleed marginInline="full" asChild reflectivePadding>
            <section
              className="product-page-bleed-section product-page-bleed-section__red spacing-top--small"
              aria-label="Informasjon om rammeavtalene hjelpemiddelet er på"
            >
              <div>
                <Heading level="2" size="large" spacing id="agreement-info" tabIndex={-1}>
                  Avtale med Nav
                </Heading>
                <AgreementInfo product={product} productsOnPosts={productsOnPosts} />
              </div>
            </section>
          </Bleed>
        )}

        {/* TODO: Fjerne accessories && accessories.length > 0 slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}
        {hasAccessories && (
          <Bleed marginInline="full" asChild reflectivePadding>
            <section
              className="product-page-bleed-section product-page-bleed-section__yellow  spacing-top--small"
              aria-label="Tilbehør som passer til hjelpemiddelet"
            >
              <AccessoriesAndSparePartsInfo products={accessories} type={'Accessories'} />
            </section>
          </Bleed>
        )}
        {/* TODO: Fjerne spareParts && spareParts.length > 0 &&  slik at section med overskrift og forklaring på at det ikke finnes noen tilbehør rendres fra komponenten */}

        {hasSpareParts && (
          <Bleed marginInline="full" asChild reflectivePadding>
            <section
              className="product-page-bleed-section product-page-bleed-section__blue  spacing-top--small"
              aria-label="Reservedeler som passer til hjelpemiddelet"
            >
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
      {/* <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#egenskaper">
            Finn HMS-nummer
          </Button> */}

      <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#egenskaper">
        Egenskaper
      </Button>

      <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#video">
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
