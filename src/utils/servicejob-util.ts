import { AgreementInfo } from '@/utils/product-util'
import { AgreementInfoResponse, SearchResponse, ServiceAgreementInfoResponse, ServiceJobSourceResponse } from '@/utils/response-types'

export interface ServiceJob {
  id: string
  title: string
  hmsArtNr: string
  supplierRef: string | null
  isoCategory: string
  supplierId: string
  supplierName: string
  status: ServiceJobSourceResponse['status']
  created: string
  updated: string
  expired: string
  createdBy: string
  updatedBy: string
  agreements: ServiceAgreementInfo[]
  keywords?: string[]
  text?: string
  url?: string
  serviceFor?: string
}

export interface ServiceAgreementInfo {
  agreementId: string
  status: string
  published: string
  expired: string
}

export const mapServicejobs = (data: SearchResponse): ServiceJob[] => {
  const sources = data.hits.hits.map((h) => h._source as ServiceJobSourceResponse)

  return sources.map((source) => {
    return mapServiceJobFromSource(source)
  })
}

const mapServiceJobFromSource = (source: ServiceJobSourceResponse, agreements: AgreementInfo[] = []): ServiceJob => {
  return {
    id: source.id,
    title: source.title,
    hmsArtNr: source.hmsArtNr,
    supplierRef: source.supplierRef,
    isoCategory: source.isoCategory,
    supplierId: source.supplier.id,
    supplierName: source.supplier.name,
    status: source.status,
    created: source.created,
    updated: source.updated,
    expired: source.expired,
    createdBy: source.createdBy,
    updatedBy: source.updatedBy,
    agreements: mapServiceAgreementInfo(source.agreements),
    keywords: source.attributes.keywords,
    text: source.attributes.text,
    url: source.attributes.url,
  }
}

const mapServiceAgreementInfo = (data: ServiceAgreementInfoResponse[]): ServiceAgreementInfo[] => {
  return data.map((agreement) => {
    return {
      agreementId: agreement.agreementId,
      status: agreement.status,
      published: agreement.published,
      expired: agreement.expired,
    }
  })
}
