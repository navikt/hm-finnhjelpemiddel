import Image from 'next/image'
import { opprettProdukt } from '../../../utils/productType'
import { fetchAlleProdukter } from '../../sok/api'

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
  const produktInfo = opprettProdukt(res.hits.hits[0]?._source)

  const images = produktInfo.images?.map(({ order, url }) => (
    <Image
      key={url}
      src={url}
      alt={'Bilde nummer ' + String(order)}
      width={400}
      height={300}
      style={{ objectFit: 'contain' }}
    />
  ))

  return (
    <article className="flex-wrapper">
      <section className="flex-wrapper">
        <aside className="image-container">{images}</aside>
        <div className="produkt-compact-info"></div>
      </section>
      <section>
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
