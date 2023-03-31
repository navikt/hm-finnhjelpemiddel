import Link from 'next/link'
import { InferGetServerSidePropsType } from 'next'
import { Heading } from '@navikt/ds-react'

import { mapSupplier } from '../../utils/supplier-util'
import { getProduct, getSupplier, getSeries } from '../../utils/api-util'
import { createProduct, mapProducts, toSearchQueryString } from '../../utils/product-util'
import { useHydratedSearchStore } from '../../utils/search-state-util'
import PhotoSlider from '../../components/photo-slider/PhotoSlider'
import SimilarProducts from '../../components/product-details/SimilarProducts'
import AnimateLayout from '../../components/layout/AnimateLayout'
import InformationTabs from 'src/components/information-tabs/InformationTabs'

export async function getServerSideProps(context: { params: { id: string } }) {
  const productData = await getProduct(context.params.id)
  const product = createProduct(productData._source)

  const supplierData = product.supplierRef ? await getSupplier(String(product.supplierRef)) : null
  const supplier = supplierData ? mapSupplier(supplierData._source) : null

  const seriesData = product.seriesId ? await getSeries(String(product.seriesId)) : null
  const seriesProducts = seriesData ? mapProducts(seriesData).filter((prod) => prod.id !== product.id) : null

  const serializedData = JSON.parse(JSON.stringify({ product, supplier, seriesProducts }))

  return {
    props: { ...serializedData },
  }
}

export default function ProduktPage({
  product,
  supplier,
  seriesProducts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { searchData } = useHydratedSearchStore()

  return (
    <>
      <nav className="breadcrumbs">
        <ol>
          <li>
            <Link href={'/' + toSearchQueryString(searchData)}>Oversikt</Link>
            <NextIcon />
          </li>
          <li>{product.title}</li>
        </ol>
      </nav>
      <AnimateLayout>
        <article className="produkt-info">
          <section className="bilde-og-beskrivelse">
            <aside>{product.photos && <PhotoSlider photos={product.photos} />}</aside>
            <div className="produkt-beskrivelse">
              <Heading level="1" size="large">
                {product.title}
              </Heading>
              {product.attributes?.articlename && <p>{product.attributes?.articlename}</p>}
              {product.attributes?.shortdescription && <p>{product.attributes?.shortdescription}</p>}
              {product.attributes?.text && <p>{product.attributes?.text}</p>}
              <div className="leverandør">
                <Heading level="2" size="medium">
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
          <section className="product-info-tabs">
            <InformationTabs product={product}></InformationTabs>
          </section>
          {seriesProducts && seriesProducts.length > 0 && (
            <section className="similar-products">
              <SimilarProducts mainProduct={product} seriesProducts={seriesProducts} />
            </section>
          )}
        </article>
      </AnimateLayout>
    </>
  )
}

const NextIcon = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      role="img"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m17.414 12-7.707 7.707-1.414-1.414L14.586 12 8.293 5.707l1.414-1.414L17.414 12Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}
