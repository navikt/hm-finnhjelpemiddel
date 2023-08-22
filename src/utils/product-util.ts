import { ReadonlyURLSearchParams } from 'next/navigation'

import queryString from 'querystring'

import { getPostTitle } from './agreement-util'
import { SearchParams, SelectedFilters } from './api-util'
import { FilterCategories } from './filter-util'
import {
  AgreementInfoResponse,
  BucketResponse,
  Hit,
  MediaResponse,
  MediaType,
  ProductDocResponse,
  ProductSourceResponse,
  SearchResponse,
  SeriesAggregationResponse,
  TechDataResponse,
} from './response-types'
import { initialSearchDataState } from './search-state-util'
import { capitalize } from './string-util'

export interface Product {
  id: string
  title: string
  attributes: Attributes
  applicableAgreementInfo: AgreementInfo | null
  variantCount: number
  variants: ProductVariant[]
  compareData: ComparingData
  isoCategory: string
  isoCategoryTitle: string
  isoCategoryText: string
  accessory: boolean
  sparepart: boolean
  photos: Photo[]
  documents: Document[]
  supplierId: string
  /** expired from backend is a Date data field like 2043-06-01T14:19:30.505665648*/
}

export interface ComparingData {
  techDataRange: TechDataRange
  agreementRank: number | null
}

export interface TechDataRange {
  [key: string]: { minValue: string; maxValue: string | null; unit: string }
}

export interface ProductVariant {
  id: string
  hmsArtNr: string | null
  supplierRef: string
  articleName: string
  techData: TechData
  hasAgreement: boolean
  agreementInfo: AgreementInfo | null
  filters: { [key: string]: string | number }
  expired: string
  /** expired from backend is a Date data field like 2043-06-01T14:19:30.505665648*/
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
  commonCharacteristics?: TechData
}

export interface AgreementInfo {
  id: string
  identifier: string | null
  rank: number
  postNr: number
  postIdentifier: string | null
  postTitle: string
}

/**
 * Maps results from opensearch collaps into multiple products - warning: will not include all product variants
 */
export const mapProductsFromCollapse = (data: SearchResponse): Product[] => {
  return data.hits.hits.map((hit: Hit) => mapProductWithVariants(Array(hit._source)))
}

/**
 * Maps results from search for seriesId into one product with all variants
 */
export const mapProductFromSeriesId = (data: SearchResponse): Product => {
  return mapProductWithVariants(data.hits.hits.map((h) => h._source))
}

/**
 * Maps result from indexed _doc endpoint into one product with one variant (indexed on productvariants)
 */
export const mapProductFromDoc = (data: ProductDocResponse): Product => {
  return mapProductWithVariants(Array(data._source))
}

/**
 * Maps results from search with aggregation into products with all variants
 */
export const mapProductsFromAggregation = (data: SeriesAggregationResponse): Product[] => {
  const buckets = data.aggregations.series_buckets.buckets.map((bucket: BucketResponse) =>
    mapProductWithVariants(bucket.products.hits.hits.map((h) => h._source))
  )
  return buckets
}

export const mapProductWithVariants = (sources: ProductSourceResponse[]): Product => {
  let applicableAgreementInfo: AgreementInfo | null = null
  const variants = sources.map((source) => {
    if (
      source.agreementInfo &&
      (applicableAgreementInfo === null || source.agreementInfo.rank < applicableAgreementInfo.rank)
    ) {
      applicableAgreementInfo = mapAgreementInfo(source.agreementInfo)
    }

    return mapProductVariant(source)
  })

  const variantsCopy = variants
  const allTechKeys = [...new Set(variantsCopy.flatMap((variant) => Object.keys(variant.techData)))]

  let commonCharacteristics: TechData = {}

  for (const key of allTechKeys) {
    const firstObj = variants.find((v) => key in v.techData)!.techData[key]

    const allTheSame =
      variants.length > 1
        ? variants
            .filter((variant) => key in variant.techData)
            .find(
              (obj) =>
                obj.techData[key].value !== firstObj.value ||
                obj.techData[key].unit !== firstObj.unit ||
                obj.techData[key].unit !== ''
            ) === undefined
        : true

    if (allTheSame) {
      Object.assign(commonCharacteristics, {
        [key]: { value: firstObj.value.length > 1 ? capitalize(firstObj.value) : firstObj.value, unit: firstObj.unit },
      })
    }
  }

  // TODO: Should we use the first variant? Values should be the same but should we check that they are?
  const firstVariant = sources[0]
  return {
    id: firstVariant.seriesId,
    title: firstVariant.title,
    attributes: { ...firstVariant.attributes, commonCharacteristics },
    applicableAgreementInfo: applicableAgreementInfo,
    variantCount: sources.length,
    variants: variants,
    compareData: {
      techDataRange: {},
      agreementRank: null,
    },
    isoCategory: firstVariant.isoCategory,
    isoCategoryTitle: firstVariant.isoCategoryTitle,
    isoCategoryText: firstVariant.isoCategoryText,
    accessory: firstVariant.accessory,
    sparepart: firstVariant.sparepart,
    photos: mapPhotoInfo(firstVariant.media),
    documents: mapDocuments(firstVariant.media),
    supplierId: firstVariant.supplier?.id,
  }
}

export const mapProductVariant = (source: ProductSourceResponse): ProductVariant => {
  return {
    id: source.id,
    hmsArtNr: source.hmsArtNr,
    supplierRef: source.supplierRef,
    articleName: source.articleName,
    techData: mapTechDataDict(source.data),
    hasAgreement: source.hasAgreement,
    agreementInfo: source.agreementInfo ? mapAgreementInfo(source.agreementInfo) : null,
    filters: source.filters,
    expired: source.expired,
    /** expired from backend is a Date data field like 2043-06-01T14:19:30.505665648 */
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

export const mapProductSearchParams = (searchParams: ReadonlyURLSearchParams | null): SearchParams => {
  const searchTerm = searchParams?.get('term') ?? ''
  const isoCode = searchParams?.get('isoCode') ?? ''
  const agreement = searchParams?.get('agreement')

  //default value is false when initiating search
  const hasAgreementsOnly = agreement ? agreement === 'true' : false

  const to = parseInt(searchParams?.get('to') ?? '') ?? undefined

  const filterKeys = Object.keys(FilterCategories).filter((filter) => searchParams?.has(filter))

  const filters = filterKeys.reduce(
    (obj, fk) => ({
      ...obj,
      [fk]: searchParams?.getAll(fk),
    }),
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
