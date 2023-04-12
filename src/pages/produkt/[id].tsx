import Link from 'next/link'
import { InferGetServerSidePropsType } from 'next'
import { Heading, GuidePanel } from '@navikt/ds-react'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { mapSupplier, Supplier } from '../../utils/supplier-util'
import { getProduct, getSupplier, getSeries, getAgreement } from '../../utils/api-util'
import { createProduct, mapProducts, Product, toSearchQueryString } from '../../utils/product-util'
import { useHydratedSearchStore } from '../../utils/search-state-util'
import PhotoSlider from '../../components/photo-slider/PhotoSlider'
import SimilarProducts from '../../components/product-details/SimilarProducts'
import AnimateLayout from '../../components/layout/AnimateLayout'
import InformationTabs from 'src/components/information-tabs/InformationTabs'
import DefinitionList from 'src/components/definition-list/DefinitionList'
import { getIsoCategoryName } from 'src/utils/iso-category-util'
import { Agreement, getPostTitle, mapAgreement } from 'src/utils/agreement-util'

type SerializedDataType = {
  product: Product
  supplier: Supplier
  seriesProducts: Product[]
  agreement: Agreement
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

  const serializedData: SerializedDataType = JSON.parse(
    JSON.stringify({ product, supplier, seriesProducts, agreement })
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { searchData } = useHydratedSearchStore()
  const postTitle = product.agreementInfo?.postNr ? getPostTitle(agreement.posts, product.agreementInfo.postNr) : ''

  return (
    <>
      <nav className="breadcrumbs">
        <ol>
          <li>
            <Link href={'/' + toSearchQueryString(searchData)}>Oversikt</Link>
            <ChevronRightIcon title="right arrow" />
          </li>
          <li>{product.title}</li>
        </ol>
      </nav>
      <AnimateLayout>
        <article className="product-info">
          <section className="product-info__top">
            <aside>{product.photos && <PhotoSlider photos={product.photos} />}</aside>
            <div className="product-info__top-right">
              <Heading level="1" size="large">
                {product.attributes.series ? product.attributes.series : product.title}
              </Heading>
              <DefinitionList>
                <DefinitionList.Term>HMS-nr.</DefinitionList.Term>
                <DefinitionList.Definition>
                  {product.hmsArtNr ? product.hmsArtNr : 'Mangler HMS-nr.'}
                </DefinitionList.Definition>
                <DefinitionList.Term>Lev-artnr.</DefinitionList.Term>
                <DefinitionList.Definition>
                  {product.supplierRef ? product.supplierRef : 'Mangler lev-artnr.'}
                </DefinitionList.Definition>
                <DefinitionList.Term>Iso-klassifisering</DefinitionList.Term>
                <DefinitionList.Definition>{getIsoCategoryName(product.isoCategory)}</DefinitionList.Definition>
                <DefinitionList.Term>På bestillingsordning</DefinitionList.Term>
                <DefinitionList.Definition>
                  {product.attributes.bestillingsordning ? 'Ja' : 'Nei'}
                </DefinitionList.Definition>
              </DefinitionList>
              <div className="product-info__supplier-info">
                <Heading level="2" size="small">
                  Leverandør
                </Heading>
                {supplier && (
                  <>
                    <p>{supplier.name}</p>
                    {supplier.address && <p>{supplier.address}</p>}
                    {supplier.email && <p>{supplier.email}</p>}
                    {supplier.homepageUrl && (
                      <a href={supplier?.homepageUrl} target="_blank" rel="noreferrer">
                        Hjemmeside(åpnes i ny side)
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
          <section>
            {product.agreementInfo && (
              <div className="product-info__agreement-info">
                <GuidePanel>
                  Dette produktet er på avtale med Nav og er rangert som nr {product.agreementInfo.rank} under post{' '}
                  {product.agreementInfo.postNr}: {postTitle}.
                  <br />
                  <br />
                  Du kan lese mer om avtalen for {agreement.title}{' '}
                  <a
                    target="_blank"
                    href={`https://www.hjelpemiddeldatabasen.no/news.asp?newsid=${
                      product.agreementInfo.identifier ? product.agreementInfo.identifier.slice(-4) : ''
                    }&x_newstype=7`}
                  >
                    her (åpes på ny side)
                  </a>{' '}
                  <br />
                  <br />
                  Det vil si at ... ?
                </GuidePanel>
              </div>
            )}
          </section>

          <section className="product-info__tabs">
            <InformationTabs product={product} supplier={supplier}></InformationTabs>
          </section>
          {seriesProducts && seriesProducts.length > 0 && (
            <section className="product-info__similar-products">
              <SimilarProducts mainProduct={product} seriesProducts={seriesProducts} />
            </section>
          )}
        </article>
      </AnimateLayout>
    </>
  )
}
