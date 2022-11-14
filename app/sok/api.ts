import { Produkt } from '../../utils/productType'

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
      const produkter: Produkt[] = data.hits.hits.map((hit: any) => {
        const produkt = hit._source
        return {
          id: produkt.id,
          tittel: produkt.title,
          modell: {
            navn: produkt.description.modelName,
            tilleggsinfo: produkt.description.modelDescription,
            beskrivelse: produkt.description.text,
          },
          isoKode: produkt.isoCategory,
          tilbehør: produkt.accessory,
          del: produkt.part,
          hmsNr: produkt.hmsartNr,
          tekniskData: produkt.data,
        }
      })
      return { antallProdukter: data.hits.total.value, produkter }
    })
}
