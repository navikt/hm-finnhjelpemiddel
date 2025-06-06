import { AlternativeProductSourceResponse, Hit, SearchResponse } from '@/utils/response-types'

//if HM_SEARCH_URL is undefined it means that we are on the client and we want to use relative url
const HM_SEARCH_URL = process.env.HM_SEARCH_URL || ''

export interface AlternativeProduct {
  seriesId: string
  id: string
  seriesTitle: string
  variantTitle: string
  status: 'INACTIVE' | 'ACTIVE'
  hmsArtNr: string | null
  imageUri: string | undefined
  supplierName: string
  highestRank: number
  onAgreement: boolean
  warehouseStock: WarehouseStock[]
  inStockAnyWarehouse: boolean
}

export interface WarehouseStock {
  location: string
  available: number
  reserved: number
  needNotified: number
  actualAvailable: number
}

const mapToAlternativeProducts = (data: SearchResponse): AlternativeProduct[] => {
  return data.hits.hits.map((hit: Hit) => mapToAlternativeProduct(hit._source as AlternativeProductSourceResponse))
}

const mapToAlternativeProductFromSource = (data: SearchResponse): AlternativeProduct => {
  return data.hits.hits.map((hit: Hit) => mapToAlternativeProduct(hit._source as AlternativeProductSourceResponse))[0]
}

const mapToAlternativeProduct = (source: AlternativeProductSourceResponse): AlternativeProduct => {
  return {
    seriesId: source.seriesId,
    id: source.id,
    seriesTitle: source.title,
    variantTitle: source.articleName,
    imageUri: source.media.filter((media) => media.type === 'IMAGE').sort((a, b) => a.priority - b.priority)[0]?.uri,
    status: source.status,
    hmsArtNr: source.hmsArtNr,
    supplierName: source.supplier?.name ?? '',
    highestRank: source.agreements.length > 0 ? Math.max(...source.agreements.map((agreement) => agreement.rank)) : 99,
    onAgreement: source.agreements.length > 0,
    warehouseStock: source.wareHouseStock
      .filter((stock) => stock.location != 'Telemark')
      .map((stock) => {
        return {
          location: stock.location,
          available: stock.available,
          reserved: stock.reserved,
          needNotified: stock.needNotified,
          actualAvailable: Math.max(stock.available - stock.needNotified, 0),
        }
      }),
    inStockAnyWarehouse: !!source.wareHouseStock.find((stock) => stock.available - stock.needNotified > 0),
  }
}

export async function getOriginalProductFromHmsArtNr(hmsArtNr: string): Promise<AlternativeProduct> {
  const res = await fetch(HM_SEARCH_URL + '/alternative_products/_search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        match: {
          hmsArtNr: hmsArtNr,
        },
      },
    }),
  })

  return res.json().then(mapToAlternativeProductFromSource)
}

export async function getAlternativeProductsFromHmsArtNr(hmsArtNr: string): Promise<AlternativeProduct[]> {
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
                ],
              },
            },
          ],
        },
      },
      size: 100,
    }),
  })

  return res.json().then(mapToAlternativeProducts)
}
