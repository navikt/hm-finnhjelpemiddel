import { createSupplier } from '../../../utils/supplier-util'
import { getProdukt, getSupplier } from '../../../utils/api-util'
import { opprettProdukt } from '../../../utils/produkt-util'
import PhotoSlider from './PhotoSlider'
import InfoAccordion from './InfoAccordion'
import Link from 'next/link'
import './produkt.scss'

export default async function ProduktPage({ params }: any) {
  const { id } = params

  const productData = await getProdukt(id)
  const product = opprettProdukt(productData._source)

  const supplierData = await getSupplier(String(product.supplierId))
  const supplier = createSupplier(supplierData._source)

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
            <h1>{product.tittel}</h1>
            {product.modell?.navn && <p>{product.modell.navn}</p>}
            {product.modell?.beskrivelse && <p>{product.modell.beskrivelse}</p>}
            {product.modell?.tilleggsinfo && <p>{product.modell.tilleggsinfo}</p>}
            <div className="leverandør">
              <h2>Leverandør</h2>
              <p>{supplier.name}</p>
              {supplier.address && <p>{supplier.address}</p>}
              {supplier.email && <p>{supplier.email}</p>}
              {supplier.homepageUrl && <a href={supplier.homepageUrl}>Hjemmeside</a>}
            </div>
          </div>
        </section>
        <section className="produkt-detaljert-info">
          {product.tekniskData && <InfoAccordion tekniskData={product.tekniskData} />}
        </section>
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
