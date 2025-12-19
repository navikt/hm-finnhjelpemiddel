import { CustomError, fetcherModify } from '@/utils/api-util'

//if HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL is undefined it means that we are on the client and we want to use relative url
const HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL = process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL || ''

export interface AlternativeStockResponseNew {
  original: AlternativeProduct
  alternatives: AlternativeProduct[]
}

export interface AlternativesWithStockGroupedResponse {
  original: AlternativeProduct
  groups: AlternativeProduct[][]
}

export interface AlternativeProduct {
  seriesId: string
  variantId: string
  seriesTitle: string
  variantTitle: string
  status: 'INACTIVE' | 'ACTIVE'
  hmsArtNr: string | null
  imageUri: string | undefined
  supplierName: string
  highestRank: number
  onAgreement: boolean
  warehouseStock: WarehouseStock[] | undefined
  inStockAnyWarehouse: boolean
}

export interface WarehouseStock {
  location: string
  available: number
}

export async function getAlternativesGrouped(
  hmsArtNr: string
): Promise<AlternativesWithStockGroupedResponse | undefined> {
  const res = await fetch(
    HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + `/alternative_products/alternativ/alternatives-groups/${hmsArtNr}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (res.status === 404) {
    return undefined
  }

  return res.json()
}

export async function newGetAlternatives(hmsArtNr: string): Promise<AlternativeStockResponseNew> {
  const res = await fetch(
    HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + `/alternative_products/alternativ/alternatives/${hmsArtNr}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (res.status === 404) {
    throw new CustomError(res.statusText, res.status)
  }

  return res.json()
}

export async function addAlternativeToGroup(alternativeGroup: string[], alternative: string): Promise<void> {
  return await fetcherModify(
    HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + `/alternative_products/hmsArtNrMapping/group/add`,
    'POST',
    {
      group: alternativeGroup,
      alternative: alternative,
    }
  )
}

export async function deleteAlternativeFromGroup(alternativeGroup: string[], alternative: string): Promise<void> {
  return await fetcherModify(
    HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + `/alternative_products/hmsArtNrMapping/group/delete`,
    'DELETE',
    {
      group: alternativeGroup,
      alternative: alternative,
    }
  )
}
