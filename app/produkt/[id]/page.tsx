import { opprettProdukt } from '../../../utils/produkt-util'
import ImageSlider from './ImageSlider'
import InfoAccordion from './InfoAccordion'
import './produkt.scss'

async function fetchProdukt(id: string) {
  const res = await fetch('https://grunndata-search.dev-gcp.nais.io/product/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        match: {
          _id: id,
        },
      },
    }),
  })

  return res.json()
}

export default async function ProduktPage({ params, searchParams }: any) {
  const { id } = params

  const res = await fetchProdukt(id)
  const produktInfo = opprettProdukt(res.hits.hits?.at(0)?._source)

  return (
    <article className="produkt-info">
      <section className="bilde-og-beskrivelse">
        <aside>{produktInfo?.bilder && <ImageSlider bilder={produktInfo?.bilder} />}</aside>
        <div className="produkt-beskrivelse">
          <h1>{produktInfo.tittel}</h1>
          <p>{produktInfo?.modell?.navn && produktInfo?.modell?.navn}</p>
          <p>{produktInfo?.modell?.beskrivelse && produktInfo?.modell?.beskrivelse}</p>
          <p>{produktInfo?.modell?.tilleggsinfo && produktInfo?.modell?.tilleggsinfo}</p>
          <div className="leverandør">
            <h2>Leverandør</h2>
            <p>Navn på leverandør</p>
            <p>Adresselinje 1</p>
            <p>0000, Oslo</p>
            <a href="www.vg.no">Lenke til nettsted</a>
          </div>
        </div>
      </section>
      <section className="produkt-detaljert-info">
        {produktInfo.tekniskData && <InfoAccordion tekniskData={produktInfo.tekniskData} />}
      </section>
    </article>
  )
}
