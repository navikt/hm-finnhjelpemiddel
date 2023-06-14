import Link from 'next/link'
import Image from 'next/image'
import { InferGetServerSidePropsType } from 'next'
import { Heading, Button, BodyShort, Alert, BodyLong } from '@navikt/ds-react'
import { ArrowDownIcon, ChevronRightIcon, ImageIcon } from '@navikt/aksel-icons'
import { mapSupplier, Supplier } from '@/utils/supplier-util'
import { getProduct, getSupplier, getSeries, getAgreement, getProductsInPost } from '@/utils/api-util'
import { smallImageLoader } from '@/utils/image-util'
import { createProduct, mapProducts, Product, toSearchQueryString } from '@/utils/product-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'
import PhotoSlider from '@/components/PhotoSlider'
import SimilarProducts from '@/components/SimilarProducts'
import AnimateLayout from '@/components/layout/AnimateLayout'
import InformationTabs from '@/components/InformationTabs'
import DefinitionList from 'src/components/definition-list/DefinitionList'
import { Agreement, getPostTitle, mapAgreement } from 'src/utils/agreement-util'
import AgreementIcon from '@/components/AgreementIcon'
import { RefObject, useRef } from 'react'

type SerializedDataType = {
  product: Product
  supplier: Supplier
  seriesProducts: Product[]
  agreement: Agreement | null
  productsOnPost: Product[]
}

export async function getServerSideProps(context: { params: { id: string } }) {
  const productData = await getProduct(context.params.id)
  const product = createProduct(productData._source)

  const supplierData = product.supplierId ? await getSupplier(String(product.supplierId)) : null
  const supplier = supplierData ? mapSupplier(supplierData._source) : null

  const seriesData = product.seriesId ? await getSeries(String(product.seriesId)) : null
  const seriesProducts = seriesData ? mapProducts(seriesData).filter((prod) => prod.id !== product.id) : null

  const agreementData = product.agreementInfo?.id ? await getAgreement(String(product.agreementInfo?.id)) : null
  const agreement = agreementData ? mapAgreement(agreementData._source) : null

  const productsOnPostData = product.agreementInfo
    ? await getProductsInPost(String(product.agreementInfo?.postIdentifier))
    : null
  const productsOnPost = productsOnPostData
    ? mapProducts(productsOnPostData)
        .filter((postProduct) => postProduct.id !== product.id)
        .sort((productA, productB) =>
          productA.agreementInfo && productB.agreementInfo
            ? productA.agreementInfo?.rank - productB.agreementInfo?.rank
            : -1
        )
    : null

  const serializedData: SerializedDataType = JSON.parse(
    JSON.stringify({ product, supplier, seriesProducts, agreement, productsOnPost })
  )

  return {
    props: { ...serializedData },
  }
}

export default function ProduktPage({
  product,
  supplier,
  seriesProducts,
  agreement,
  productsOnPost,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { searchData } = useHydratedSearchStore()

  const agreementHeadingRef = useRef<HTMLHeadingElement>(null)

  const scrollToAgreementInfo = () => {
    agreementHeadingRef.current && agreementHeadingRef.current.scrollIntoView()
  }
  return (
    <>
      <nav className="breadcrumbs">
        <ol>
          <li>
            <Link href={'/sok' + toSearchQueryString(searchData)}>Oversikt</Link>
            <ChevronRightIcon title="right arrow" />
          </li>
          <li>{product.title}</li>
        </ol>
      </nav>
      <AnimateLayout>
        <article className="product-info">
          <section className="product-info__top">
            <div className="product-info__top-content max-width">
              <aside>{product.photos && <PhotoSlider photos={product.photos} />}</aside>
              <div className="product-info__top-right">
                <Heading level="1" size="large" spacing>
                  {product.attributes.series ? product.attributes.series : product.title}
                </Heading>
                {product.agreementInfo && (
                  <div className="agreement-summary">
                    <AgreementIcon rank={product.agreementInfo.rank} />
                    <div className="agreement-summary__content">
                      <BodyShort>Produktet er nr. {product.agreementInfo.rank} på avtale med NAV</BodyShort>
                      <Button
                        variant="tertiary"
                        onClick={scrollToAgreementInfo}
                        icon={<ArrowDownIcon />}
                        iconPosition="right"
                        size="small"
                      >
                        Les mer om avtalen lenger ned
                      </Button>
                    </div>
                  </div>
                )}
                <div className="product-info__expired-propducts">
                  {new Date(product.expired).getTime() <= Date.now() && (
                    <Alert variant="warning">Dette produktet er utgått</Alert>
                  )}
                </div>
                <KeyInformation product={product} supplierName={supplier ? supplier.name : null} />
              </div>
            </div>
          </section>

          <section className="product-info__tabs max-width">
            <InformationTabs product={product} supplier={supplier} />
          </section>
          {seriesProducts && seriesProducts.length > 0 && (
            <section className="product-info__similar-products max-width">
              <SimilarProducts mainProduct={product} seriesProducts={seriesProducts} />
            </section>
          )}
          <AgreementInfo
            product={product}
            agreement={agreement}
            productsOnPost={productsOnPost}
            agreementHeadingRef={agreementHeadingRef}
          />
        </article>
      </AnimateLayout>
    </>
  )
}

type AgreementInfoProps = {
  product: Product
  agreement: Agreement | null
  productsOnPost: Product[]
  agreementHeadingRef: RefObject<HTMLHeadingElement>
}

const AgreementInfo = ({ product, agreement, productsOnPost, agreementHeadingRef }: AgreementInfoProps) => {
  const postTitle =
    product.agreementInfo?.postNr && agreement ? getPostTitle(agreement.posts, product.agreementInfo.postNr) : ''

  if (!agreement) {
    return (
      <section className="agreement-details">
        <div className="agreement-details__content max-width">
          <Heading level="3" size="large">
            Avtale med Nav
          </Heading>

          <Alert className="alert--fit-content" variant="error">
            Dette produktet er ikke på avtale med NAV
          </Alert>

          <BodyLong>
            Produkter som ikke er på avtale på NAV blir ikke prioritert. Dersom du ønsker å få støtte lønner det seg å
            se på de andre produktene som er i samme kategori for å se om de passer behovene dine
          </BodyLong>
        </div>
      </section>
    )
  }

  return (
    <section className="agreement-details">
      <div className="agreement-details__content max-width">
        <Heading level="3" size="large" ref={agreementHeadingRef}>
          Avtale med Nav
        </Heading>

        {product.agreementInfo && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AgreementIcon rank={product.agreementInfo.rank} />
            <BodyShort>Rangert som nr. {product.agreementInfo.rank}</BodyShort>
          </div>
        )}
        <DefinitionList>
          <DefinitionList.Term>Avtale</DefinitionList.Term>
          <DefinitionList.Definition>{agreement.title}</DefinitionList.Definition>
          <DefinitionList.Term>Delkontrakt</DefinitionList.Term>
          <DefinitionList.Definition>{postTitle}</DefinitionList.Definition>
        </DefinitionList>
        {product.agreementInfo && product.agreementInfo.rank > 1 && (
          <Alert variant="warning" inline>
            Den er rangert som nummer {product.agreementInfo.rank} i delkontrakten. Ta en titt på høyere rangerte
            produkter for å se om det passer ditt behov.
          </Alert>
        )}
        {productsOnPost.length > 1 && (
          <div className="product-info__products-on-post">
            <Heading level="4" size="medium" ref={agreementHeadingRef} spacing>
              Andre produkter på samme delkontrakt
            </Heading>
            <div className="product-info__products-on-post-list">
              {productsOnPost.map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-card__image">
                    <div className="image">
                      {product.photos.length === 0 && (
                        <ImageIcon
                          width="100%"
                          height="100%"
                          style={{ background: 'white' }}
                          aria-label="Ingen bilde tilgjengelig"
                        />
                      )}
                      {product.photos.length !== 0 && (
                        <Image
                          loader={smallImageLoader}
                          src={product.photos.at(0)?.uri || ''}
                          alt="Produktbilde"
                          fill
                          style={{ objectFit: 'contain' }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="info">
                    <Link className="search-result__link" href={`/produkt/${product.id}`}>
                      <Heading size="xsmall" className="product-card__product-title">
                        {product.title}
                      </Heading>
                    </Link>
                    {product.agreementInfo && <AgreementIcon rank={product.agreementInfo.rank} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

const KeyInformation = ({ product, supplierName }: { product: Product; supplierName: string | null }) => (
  <div className="product-info__key-information">
    <Heading level="2" size="medium">
      Nøkkelinfo
    </Heading>
    <DefinitionList>
      <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
      <DefinitionList.Definition>{product.hmsArtNr ? product.hmsArtNr : '-'}</DefinitionList.Definition>
      <DefinitionList.Term>Leverandør</DefinitionList.Term>
      <DefinitionList.Definition>{supplierName}</DefinitionList.Definition>
      <DefinitionList.Term>Lev-artnr.</DefinitionList.Term>
      <DefinitionList.Definition>{product.supplierRef ? product.supplierRef : '-'}</DefinitionList.Definition>
      <DefinitionList.Term>ISO-klassifisering</DefinitionList.Term>
      <DefinitionList.Definition>
        {product.isoCategoryTitle + ' (' + product.isoCategory + ')'}
      </DefinitionList.Definition>
      <DefinitionList.Term>På bestillingsordning</DefinitionList.Term>
      <DefinitionList.Definition>{product.attributes.bestillingsordning ? 'Ja' : 'Nei'}</DefinitionList.Definition>
    </DefinitionList>
  </div>
)
