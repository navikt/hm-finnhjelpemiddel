import queryString from 'querystring'
import { FilterCategories } from './filter-util'
import {
  AgreementInfoResponse,
  Hit,
  MediaResponse,
  MediaType,
  ProductSourceResponse,
  SearchResponse,
  TechDataResponse,
} from './response-types'
import { initialSearchDataState } from './search-state-util'
import { SearchParams, SelectedFilters } from './api-util'
import { getPostTitle } from './agreement-util'

export interface Product {
  id: string
  articleName: string
  title: string
  attributes: Attributes
  techData: TechData
  hasAgreement: boolean
  hmsArtNr: string | null
  agreementInfo: AgreementInfo | null
  isoCategory: string
  isoCategoryTitle: string
  isoCategoryText: string
  accessory: boolean
  sparepart: boolean
  photos: Photo[]
  documents: Document[]
  supplierId: string
  supplierRef: string
  seriesId: string | null
  filters: { [key: string]: string | number }
}

export interface Photo {
  uri: string
}

export interface Document {
  uri: string
  title: string
}

export interface TechData {
  [key: string]: { value: string; unit: string }
}

interface Attributes {
  manufacturer?: string
  articlename?: string
  series?: string
  shortdescription?: string
  text?: string
  bestillingsordning?: boolean
}

interface AgreementInfo {
  id: string
  identifier: string | null
  rank: number
  postNr: number
  postIdentifier: string | null
  postTitle: string
}

export const createProduct = (source: ProductSourceResponse): Product => {
  return {
    id: source.id,
    articleName: source.articleName,
    title: source.title,
    attributes: source.attributes,
    techData: mapTechDataDict(source.data),
    hmsArtNr: source.hmsArtNr,
    hasAgreement: source.hasAgreement,
    agreementInfo: source.agreementInfo ? mapAgreementInfo(source.agreementInfo) : null,
    isoCategory: source.isoCategory,
    isoCategoryTitle: source.isoCategoryTitle,
    isoCategoryText: source.isoCategoryText,
    accessory: source.accessory,
    sparepart: source.sparepart,
    photos: mapPhotoInfo(source.media),
    documents: mapDocuments(source.media),
    seriesId: source.seriesId,
    supplierId: source.supplier?.id,
    supplierRef: source.supplierRef,
    filters: source.filters,
  }
}

const mapPhotoInfo = (media: MediaResponse[]): Photo[] => {
  const seen: { [uri: string]: boolean } = {}
  return media
    .filter((media: MediaResponse) => {
      if (!(media.type == MediaType.IMAGE && media.priority && media.uri) || seen[media.uri]) {
        return false
      }

      seen[media.uri] = true
      return true
    })
    .sort((a: MediaResponse, b: MediaResponse) => a.priority - b.priority)
    .map((image: MediaResponse) => ({
      uri: image.uri,
    }))
}

const mapDocuments = (media: MediaResponse[]): Document[] => {
  const seen: { [uri: string]: boolean } = {}
  return media
    .filter((media: MediaResponse) => {
      if (!(media.type == MediaType.PDF && media.text && media.uri) || seen[media.uri]) {
        return false
      }

      seen[media.uri] = true
      return true
    })
    .sort((a: MediaResponse, b: MediaResponse) => (a.text && b.text ? (a.text > b.text ? 1 : -1) : -1))
    .map((doc: MediaResponse) => ({
      uri: doc.uri,
      title: doc.text ? doc.text : '',
    }))
}

const mapTechDataDict = (data: Array<TechDataResponse>): TechData => {
  return Object.assign(
    {},
    ...data
      .filter((data: TechDataResponse) => data.key && data.value)
      .map((data: TechDataResponse) => ({ [data.key]: { value: data.value, unit: data.unit } }))
  )
}

const mapAgreementInfo = (data: AgreementInfoResponse): AgreementInfo => ({
  id: data.id,
  identifier: data.identifier,
  postIdentifier: data.postIdentifier,
  postNr: data.postNr,
  postTitle: getPostTitle(data.postTitle, data.postNr),
  rank: data.rank,
})

export const mapProducts = (data: SearchResponse): Product[] => {
  return data.hits.hits.map((hit: Hit) => createProduct(hit._source))
}

export const mapProductSearchParams = (searchParams: { [key: string]: any }) => {
  const searchTerm = searchParams.term ?? ''
  const isoCode = searchParams.isoCode ?? ''
  const hasAgreementsOnly = searchParams.agreement ? searchParams.agreement === 'true' : true

  const to = parseInt(searchParams.to) ?? undefined

  const filterKeys = Object.keys(FilterCategories).filter((filter) =>
    Array.from(Object.keys(searchParams)).includes(filter)
  )

  const filters = filterKeys.reduce(
    (obj, fk) => ({ ...obj, [fk]: Array.isArray(searchParams[fk]) ? searchParams[fk] : [searchParams[fk]] }),
    {}
  )

  return {
    searchTerm,
    isoCode,
    hasAgreementsOnly,
    filters: { ...initialSearchDataState.filters, ...filters },
    to,
  }
}

export const toSearchQueryString = (searchParams: SearchParams) =>
  '?' +
  queryString.stringify({
    agreement: searchParams.hasAgreementsOnly,
    ...(searchParams.searchTerm && { term: searchParams.searchTerm }),
    ...(searchParams.isoCode && { isoCode: searchParams.isoCode }),
    ...Object.entries(searchParams.filters)
      .filter(([_, values]) => values.some((value) => value))
      .reduce((newObject, [key, values]) => ({ ...newObject, [key]: values }), {} as SelectedFilters),
    ...(searchParams.to && { to: searchParams.to }),
  })
