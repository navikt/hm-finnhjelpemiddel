import { createProducts, Produkt } from './produkt-util'

export const PAGE_SIZE = 15

export type SearchData = { searchTerm: string; isoCode: string }

type FetchProps = {
  url: string
  pageIndex: number
  searchData: SearchData
}

export type FetchResponse = {
  antallProdukter: number
  produkter: Produkt[]
}

export const fetchProdukter = ({ url, pageIndex, searchData }: FetchProps): Promise<FetchResponse> => {
  const from = pageIndex * PAGE_SIZE
  const { searchTerm, isoCode } = searchData

  const query = {
    bool: {
      must: [
        ...(searchTerm
          ? [
              {
                simple_query_string: {
                  query: `\"${searchTerm}*\" | (${searchTerm.split(' ').join(' + ')})`,
                  fields: ['title^3', 'description.text^2', '*'],
                },
              },
            ]
          : []),
      ],
      ...(isoCode && {
        filter: {
          match_bool_prefix: {
            isoCategory: isoCode,
          },
        },
      }),
    },
  }

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      size: PAGE_SIZE,
      query,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const produkter: Produkt[] = createProducts(data)
      return { antallProdukter: data.hits.total.value, produkter }
    })
}

export async function getProdukt(id: string) {
  const res = await fetch(`https://grunndata-search.dev-gcp.nais.io/product/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getSupplier(id: string) {
  const res = await fetch(`https://grunndata-search.dev-gcp.nais.io/supplier/_doc/${id}`, {
    method: 'GET',
  })

  return res.json()
}

export async function getSeries(seriesId: string) {
  const query = {
    term: {
      'seriesId.keyword': seriesId,
    },
  }

  const res = await fetch('https://grunndata-search.dev-gcp.nais.io/product/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })
  return res.json()
}
