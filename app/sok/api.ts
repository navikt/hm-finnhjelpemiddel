import { opprettProdukter, Produkt } from '../../utils/productType'

type FetchProps = {
  url: string
  pageIndex: number
  pageSize: number
  searchTerm?: string
  isoFilter?: string
}

export type FetchResponse = {
  antallProdukter: number
  produkter: Produkt[]
}

export const fetchProdukter = ({
  url,
  pageIndex,
  pageSize,
  searchTerm,
  isoFilter,
}: FetchProps): Promise<FetchResponse> => {
  const from = pageSize * pageIndex

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
      ...(isoFilter && {
        filter: {
          match_bool_prefix: {
            isoCategory: isoFilter,
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
      size: pageSize,
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
