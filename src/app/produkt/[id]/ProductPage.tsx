import { Document, Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import File from '@/components/File'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { titleCapitalized } from '@/utils/string-util'
import { Bleed, BodyShort, Button, Heading, HGrid, HStack } from '@navikt/ds-react'
import { default as Link } from 'next/link'
import AccessoriesAndSparePartsInfo from './AccessoriesAndSparePartsInfo'
import { AgreementInfo } from './AgreementInfo'
import HmsSuggestion from './HmsSuggestion'
import ProductInformation from './ProductInformation'
import ProductPageTopInfo from './ProductPageTopInfo'
import ProductVariants from './ProductVariants'
import { Videos } from './Video'
import { ProductsOnPost } from './page'
import { useFlag } from "@/toggles/context";

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

  const flag = useFlag("adminreg.test")

  return (
    <AnimateLayout>
      <div>
        {flag.enabled && <div>{flag.name} is enabled</div>}
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
            <div className="product-page__header_anchorOffset" id="informasjon" tabIndex={-1}></div>
            <Heading level="2" size="large" spacing>
              <Link href={'#informasjon'} className="product-page__header_anchorLink">
                Beskrivelse
              </Link>
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
          <div className="product-page__header_anchorOffset" id="egenskaper" tabIndex={-1}></div>
          <Heading level="2" size="large" spacing>
            <Link href={'#egenskaper'} className="product-page__header_anchorLink">
              Egenskaper
            </Link>
          </Heading>
          <ProductVariants product={product} />
        </section>

        <section aria-label="Videolenker" className="spacing-vertical--xlarge">
          <div className="product-page__header_anchorOffset" id="video" tabIndex={-1}></div>
          <Heading level="2" size="large" spacing>
            <Link href={'#video'} className="product-page__header_anchorLink">
              Video
            </Link>
          </Heading>
          <Videos videos={product.videos} />
        </section>

        <section aria-label="Dokumenter" className="spacing-vertical--xlarge">
          <div className="product-page__header_anchorOffset" id="dokumenter" tabIndex={-1}></div>
          <Heading level="2" size="large" spacing>
            <Link href={'#dokumenter'} className="product-page__header_anchorLink">
              Dokumenter
            </Link>
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
                <div className="product-page__header_anchorOffset" id="agreement-info" tabIndex={-1}></div>
                <Heading level="2" size="large" spacing>
                  <Link href={'#agreement-info'} className="product-page__header_anchorLink">
                    Avtale med Nav
                  </Link>
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
      <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#informasjon">
        Generell informasjon
      </Button>
      {/* <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#egenskaper">
            Finn HMS-nummer
          </Button> */}

      <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#egenskaper">
        Egenskaper
      </Button>

      <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#video">
        Video
      </Button>

      <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#dokumenter">
        Dokumenter
      </Button>

      {isOnAgreement && (
        <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#agreement-info">
          Avtale med NAV
        </Button>
      )}

      {hasAccessories && (
        <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#tilbehør">
          Tilbehør
        </Button>
      )}

      {hasSpareParts && (
        <Button variant="tertiary" className="product-page__nav-button" as={Link} href="#reservedeler">
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
