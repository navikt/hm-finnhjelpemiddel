import { fetcherModify } from '@/utils/api-util'
import { headers } from 'next/headers'

//if HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL is undefined it means that we are on the client and we want to use relative url
const HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL = process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL || ''

export interface AlternativeStockResponseNew {
  original: AlternativeProduct
  alternatives: AlternativeProduct[]
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

async function exchangeToken(): Promise<string | undefined> {
  const exchangeEndpoint = process.env.NEXT_PUBLIC_NAIS_TOKEN_EXCHANGE_ENDPOINT
  const audience = process.env.NEXT_PUBLIC_ALTERNATIVER_BACKEND_AUDIENCE
  const authHeader = (await headers()).get('authorization')
  if (!exchangeEndpoint || !audience || !authHeader) {
    return undefined
  }

  const token = authHeader.replace('Bearer ', '')
  const res = await fetcherModify(exchangeEndpoint, 'POST', {
    identity_provider: 'azuread',
    target: audience,
    user_token: token,
  })

  return res.json()
}

async function getAuthHeader() {}

export async function newGetAlternatives(hmsArtNr: string): Promise<AlternativeStockResponseNew | undefined> {
  const oboToken = (await exchangeToken()) ?? ''
  const res = await fetch(
    HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + `/alternative_products/alternativ/alternatives/${hmsArtNr}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: oboToken,
      },
    }
  )

  if (res.status === 404) {
    return undefined
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
