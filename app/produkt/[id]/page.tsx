import { opprettProdukt } from '../../../utils/produkt-util'
import { fetchAlleProdukter } from '../../sok/api'
import Bildeslider from './BildeSlider'

import './produkt.scss'

//Same as: getStaticPaths
export async function generateStaticParams() {
  const dataJson = await fetchAlleProdukter()

  return dataJson.hits.hits.map((hit: any) => {
    return {
      id: String(hit._id),
    }
  })
}

async function fetchProdukt(id: string) {
  const res = await fetch('http://localhost:8080/product/_search', {
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
    cache: 'force-cache',
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
        <aside>{produktInfo?.bilder && <Bildeslider bilder={produktInfo?.bilder}></Bildeslider>}</aside>
        <div className="produkt-beskrivelse">
          <h1>{produktInfo.tittel}</h1>
          <p>{produktInfo?.modell?.navn && produktInfo?.modell?.navn}</p>
          <p>{produktInfo?.modell?.beskrivelse && produktInfo?.modell?.beskrivelse}</p>
          <p>{produktInfo?.modell?.tilleggsinfo && produktInfo?.modell?.tilleggsinfo}</p>
        </div>
      </section>
      <section className="produkt-detaljert-info">
        <dl>
          <dt>id</dt>
          <dd>{produktInfo.id}</dd>
          <dt>tittel</dt>
          <dd>{produktInfo.tittel ? produktInfo.tittel : ''}</dd>
          <dt>beskrivelse</dt>
          <dd>{produktInfo.modell?.tilleggsinfo ? produktInfo.modell?.tilleggsinfo : ''}</dd>
          <dt>er det et tilbehør</dt>
          <dd>{produktInfo.tilbehor ? 'true' : 'false'}</dd>
          <dt>er det en del</dt>
          <dd>{produktInfo.del ? 'true' : 'false'}</dd>
          <dt>hms</dt>
          <dd>{produktInfo.hmsNr && produktInfo.hmsNr}</dd>
        </dl>
      </section>
    </article>
  )
}
