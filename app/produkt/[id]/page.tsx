import './page.scss'
import { mapSupplier } from '../../../utils/supplier-util'
import { getProduct, getSupplier, getSeries } from '../../../utils/api-util'
import { Heading } from '@navikt/ds-react/esm/typography'
import { createProduct, mapProducts } from '../../../utils/product-util'
import PhotoSlider from './PhotoSlider'
import InfoAccordion from './InfoAccordion'
import Link from 'next/link'
import SimilarProducts from './SimilarProducts'

export default async function ProduktPage({ params }: any) {
  const { id } = params
  const productData = await getProduct(id)
  if (!productData._source) {
    return <h2>Feil ved lasting av produkt</h2>
  }

  const product = createProduct(productData._source)

  const supplierData = product.supplierRef ? await getSupplier(String(product.supplierRef)) : null
  const supplier = supplierData ? mapSupplier(supplierData._source) : null

  const seriesData = product.seriesId ? await getSeries(String(product.seriesId)) : null
  const seriesProducts = seriesData ? mapProducts(seriesData).filter((prod) => prod.id !== product.id) : null
  return (
    <>
      <nav className="breadcrumbs">
        <ol>
          <li>
            <Link href="/">Oversikt</Link>
            <NextIcon />
          </li>
          <li>{product.title}</li>
        </ol>
      </nav>
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
        <section className="product-accordion">
          {product.techData && <InfoAccordion techData={product.techData} />}
        </section>
        {seriesProducts && seriesProducts.length > 0 && (
          <section className="similar-products">
            <SimilarProducts mainProduct={product} seriesProducts={seriesProducts} />
          </section>
        )}
      </article>
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
