import { Produkt } from '../../utils/productType'

type FetchProps = {
  url: string
  pageIndex: number
  pageSize: number
  isoFilter: string
}

export type FetchResponse = {
  antallProdukter: number
  produkter: Produkt[]
}

export const fetchProdukter = ({ url, pageIndex, pageSize, isoFilter }: FetchProps): Promise<FetchResponse> => {
  const from = pageSize * pageIndex

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      size: pageSize,
      ...(isoFilter && {
        query: {
          match_phrase_prefix: {
            isoCategory: isoFilter,
          },
        },
      }),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const produkter: Produkt[] = data.hits.hits.map((hit: any) => {
        const produkt = hit._source
        return {
          id: produkt.id,
          tittel: produkt.title,
          modell: {
            navn: produkt.description.modelName,
            beskrivelse: produkt.description.modelDescription,
            hmm: produkt.description.text,
          },
          isoKode: Number(produkt.isoCategory),
          tilbehør: produkt.accessory,
          del: produkt.part,
        }
      })
      return { antallProdukter: data.hits.total.value, produkter }
    })
}
