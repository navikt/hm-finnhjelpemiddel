import Link from 'next/link'
import { mapSupplier } from '../../utils/supplier-util'
import { getProduct, getSupplier, getSeries } from '../../utils/api-util'
import { createProduct, mapProducts, Product } from '../../utils/product-util'
import PhotoSlider from '../../components/PhotoSlider/PhotoSlider'
import InfoAccordion from '../../components/InfoAccordion/InfoAccordion'
import SimilarProducts from '../../components/ProductDetails/SimilarProducts'
import { Heading } from '@navikt/ds-react'
import { useRouter } from 'next/router'

export default function ProduktPage() {
  const router = useRouter()
  const { id } = router.query

  //
  // const product = createProduct(productData._source)

  // const supplierData = product.supplierRef ? await getSupplier(String(product.supplierRef)) : null
  // const supplier = supplierData ? mapSupplier(supplierData._source) : null

  // const seriesData = product.seriesId ? await getSeries(String(product.seriesId)) : null
  // const seriesProducts = seriesData ? mapProducts(seriesData).filter((prod) => prod.id !== product.id) : null

  const product = {
    id: 'ea65e50f-a968-4771-9f20-d40d6bd9fcfd',
    title: 'Aerolet skråløft',
    attributes: {
      articlename: 'Aerolet skråløft',
      shortdescription: '',
      text: 'Toalettløfter for gulv- og veggmonterte toalett. Har elektrisk skråløft. Oppfellbare armlen med bryter for hev/senk på begge sider. Maks brukervekt 150 kg. ',
      series: ['Toalettløfter Aerolet '],
    },
    techData: {
      Rettløft: { value: 'NEI', unit: '' },
      Skråløft: { value: 'JA', unit: '' },
      'Betjening høyre': { value: 'JA', unit: '' },
      'Betjening venstre': { value: 'JA', unit: '' },
      'Løftehøyde min': { value: '45', unit: 'cm' },
      'Løftehøyde maks': { value: '100', unit: 'cm' },
      'Understell hreg': { value: 'JA', unit: '' },
      'Bredde innvendig': { value: '58', unit: 'cm' },
      Totalbredde: { value: '70', unit: 'cm' },
      Totallengde: { value: '53', unit: 'cm' },
      'Brukervekt maks': { value: '150', unit: 'kg' },
    },
    hmsartNr: '062665',
    supplierRef: '606c3c4c-a1ab-4604-b8ac-b2f9c4678afb',
    isoCategory: '09122101',
    accessory: false,
    sparepart: undefined,
    photos: [
      { uri: '42251.jpg' },
      { uri: '42251_2.jpg' },
      { uri: '42251_3.jpg' },
      { uri: '42251_4.jpg' },
    ],
    seriesId: 'HMDB-42251',
  }

  const supplier = {
    id: '606c3c4c-a1ab-4604-b8ac-b2f9c4678afb',
    identifier: 'HMDB-5003',
    name: 'Varodd Velferdsteknologi AS',
    address: 'P.b. 8343',
    email: 'hjelpemidler@varodd.no',
    phone: '38144800',
    homepageUrl: 'http://www.varodd.no',
  }

  const seriesProducts = null

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
        {/* {seriesProducts && seriesProducts.length > 0 && (
          <section className="similar-products">
            <SimilarProducts mainProduct={product} seriesProducts={seriesProducts} />
          </section>
        )} */}
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
