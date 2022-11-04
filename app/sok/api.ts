import { Produkt } from '../../utils/productType'

type FetchProps = {
  url: string
  pageIndex: number
}

export type FetchResponse = {
  antallProdukter: number
  produkter: Produkt[]
}

export const fetchProdukter = ({ url, pageIndex }: FetchProps): Promise<FetchResponse> => {
  const size = 20
  const from = size * pageIndex

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      size,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const produkter: Produkt[] = data.hits.hits.map((hit: any) => ({
        id: hit._source.id,
      }))
      return { antallProdukter: data.hits.total.value, produkter }
    })
}
