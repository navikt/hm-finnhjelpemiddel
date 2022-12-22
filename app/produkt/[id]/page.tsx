import { mapSupplier } from '../../../utils/supplier-util'
import { getProdukt, getSupplier, getSeries } from '../../../utils/api-util'
import { Heading } from '@navikt/ds-react/esm/typography'
import { createProduct, mapProducts } from '../../../utils/produkt-util'
import PhotoSlider from './PhotoSlider'
import InfoAccordion from './InfoAccordion'
import Link from 'next/link'
import './produkt.scss'
import SimilarProducts from './SimilarProducts'

export default async function ProduktPage({ params }: any) {
  const { id } = params

  const productData = await getProdukt(id)
  const product = createProduct(productData._source)

  const supplierData = await getSupplier(String(product.supplierId))
  const supplier = mapSupplier(supplierData._source)

  const seriesData = await getSeries(String(product.seriesId))
  const seriesProducts = mapProducts(seriesData).filter((prod) => prod.id !== product.id)

  return (
    <>
      <nav className="breadcrumbs">
        <ol>
          <li>
            <Link href="/">Oversikt</Link>
            <NextIcon />
          </li>
          <li>{product.tittel}</li>
        </ol>
      </nav>
      <article className="produkt-info">
        <section className="bilde-og-beskrivelse">
          <aside>{product.photos && <PhotoSlider photos={product.photos} />}</aside>
          <div className="produkt-beskrivelse">
            <Heading level="1" size="large">
              {product.tittel}
            </Heading>
            {product.description?.name && <p>{product.description.name}</p>}
            {product.description?.beskrivelse && <p>{product.description.beskrivelse}</p>}
            {product.description?.tilleggsinfo && <p>{product.description.tilleggsinfo}</p>}
            <div className="leverandør">
              <Heading level="2" size="medium">
                Leverandør
              </Heading>
              <p>{supplier.name}</p>
              {supplier.address && <p>{supplier.address}</p>}
              {supplier.email && <p>{supplier.email}</p>}
              {supplier.homepageUrl && (
                <a href={supplier.homepageUrl} target="_blank">
                  Hjemmeside(åpnes i ny side)
                </a>
              )}
            </div>
          </div>
        </section>
        <section className="product-accordion">
          {product.tekniskData && <InfoAccordion tekniskData={product.tekniskData} />}
        </section>
        {seriesProducts?.length > 0 && (
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
