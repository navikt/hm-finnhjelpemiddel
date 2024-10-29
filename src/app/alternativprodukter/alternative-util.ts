import { AlternativeProductSourceResponse, Hit, SearchResponse } from '@/utils/response-types'

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''

export interface AlternativeProduct {
  id: string
  title: string
  //variants: ProductVariant[]
  status: 'INACTIVE' | 'ACTIVE'
  hmsArtNr: string | null
  imageUri: string | undefined
  supplierName: string
  highestRank: number
  warehouseStock: WarehouseStock[]
}

export interface WarehouseStock {
  location: string
  available: number
  reserved: number
  needNotified: number
}

export const mapToAlternativeProducts = (data: SearchResponse): AlternativeProduct[] => {
  return data.hits.hits.map((hit: Hit) => mapToAlternativeProduct(hit._source as AlternativeProductSourceResponse))
}

export const mapToAlternativeProduct = (source: AlternativeProductSourceResponse): AlternativeProduct => {
  return {
    id: source.id,
    title: source.title,
    imageUri: source.media[0].uri,
    status: source.status,
    hmsArtNr: source.hmsArtNr,
    supplierName: source.supplier?.name ?? '',
    highestRank: Math.max(...source.agreements.map((agreement) => agreement.rank), 0),
    warehouseStock: source.wareHouseStock.map((stock) => {
      return {
        location: stock.location,
        available: stock.available,
        reserved: stock.reserved,
        needNotified: stock.needNotified,
      }
    }),
  }
}

export async function getAlternativeProductFromHmsArtNr(hmsArtNr: string): Promise<AlternativeProduct[]> {
  const res = await fetch(HM_SEARCH_URL + '/alternative_products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        bool: {
          must: [
            {
              dis_max: {
                tie_breaker: 0.7,
                queries: [
                  {
                    match: {
                      alternativeFor: hmsArtNr,
                    },
                  },
                  {
                    match: {
                      hmsArtNr: hmsArtNr,
                    },
                  },
                ],
              },
            },
          ],
          filter: [
            {
              nested: {
                path: 'wareHouseStock',
                query: {
                  bool: {
                    must: [
                      {
                        range: {
                          'wareHouseStock.available': {
                            gte: 1,
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    }),
  })

  return res.json().then(mapToAlternativeProducts)
}
