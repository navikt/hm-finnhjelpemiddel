import { opprettProdukter, Produkt } from '../../utils/produkt-util'
import { SearchData } from './Sidebar'

export const PAGE_SIZE = 15

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
      const produkter: Produkt[] = opprettProdukter(data)
      return { antallProdukter: data.hits.total.value, produkter }
    })
}

export async function fetchAlleProdukter() {
  const alleProdukter = await fetch('http://localhost:8080/product/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ size: 10000 }),
    cache: 'force-cache',
  })
  return alleProdukter.json()
}
