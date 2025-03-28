import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { Bleed, Heading, HGrid, HStack } from '@navikt/ds-react'
import { default as Link } from 'next/link'
import AccessoriesAndSparePartsInfo from './AccessoriesAndSparePartsInfo'
import { AgreementInfo } from './AgreementInfo'
import HmsSuggestion from './HmsSuggestion'
import ProductInformation from './ProductInformation'
import ProductPageTopInfo from './ProductPageTopInfo'
import { Videos } from './Video'
import { Documents } from '@/app/produkt/[id]/Documents'
import { ProductsOnPost } from '@/app/produkt/[id]/page'
import { VariantView } from '@/app/produkt/variants/VariantView'

type ProductProps = {
  product: Product
  supplier: Supplier
  accessories: Product[]
  spareParts: Product[]
  productsOnPosts?: ProductsOnPost[]
  hmsArtNr?: string
}


const ProductPage = ({ product, supplier, accessories, spareParts, productsOnPosts, hmsArtNr }: ProductProps) => {
  const isOnAgreement = product.agreements?.length > 0
  const hasAccessories = accessories.length > 0
  const hasSpareParts = spareParts.length > 0
  const showHMSSuggestion = product.isoCategory.startsWith('1222')

  return (
    <AnimateLayout>
      <div>
        <ProductPageTopInfo
          product={product}
          supplier={supplier}
          hmsArtNr={hmsArtNr}
          />
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
            <ProductInformation product={product} /></section>

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
          <VariantView product={product} />
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
      <Link href={'#informasjon'} className="product-page__nav-button">
        <span className="product-page__header_anchorLink">Generell informasjon</span>
      </Link>

      <Link href={'#egenskaper'} className="product-page__nav-button">
        <span className="product-page__header_anchorLink">Egenskaper</span>
      </Link>

      <Link href={'#video'} className="product-page__nav-button">
        <span className="product-page__header_anchorLink">Video</span>
      </Link>

      <Link href={'#dokumenter'} className="product-page__nav-button">
        <span className="product-page__header_anchorLink">Dokumenter</span>
      </Link>

      {isOnAgreement && (
        <Link href={'#agreement-info'} className="product-page__nav-button">
          <span className="product-page__header_anchorLink">Avtale med Nav</span>
        </Link>
      )}

      {hasAccessories && (
        <Link href={'#tilbehør'} className="product-page__nav-button">
          <span className="product-page__header_anchorLink">Tilbehør</span>
        </Link>
      )}

      {hasSpareParts && (
        <Link href={'#reservedeler'} className="product-page__nav-button">
          <span className="product-page__header_anchorLink">Reservedeler</span>
        </Link>
      )}
    </HGrid>
  )
}

export default ProductPage
