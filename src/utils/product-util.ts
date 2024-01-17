import { ReadonlyURLSearchParams } from 'next/navigation'

import queryString from 'querystring'

import { getPostTitle } from './agreement-util'
import { SearchData, SelectedFilters } from './api-util'
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
  agreements: AgreementInfo[]
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
  filters: { [key: string]: string | number }
  expired: string
  agreements: AgreementInfo[]
  /** expired from backend is a Date data field like 2043-06-01T14:19:30.505665648*/
}

export interface Photo {
  uri: string
}

export interface Document {
  uri: string
  title: string
  updated: Date
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
  compatibleWith?: string[]
}

export interface AgreementInfo {
  id: string
  identifier: string
  title: string
  rank: number
  postNr: number
  postTitle: string
  expired: string
}

/**
 * Maps results from opensearch collaps into multiple products - warning: will not include all product variants
 */
export const mapProductsFromCollapse = (data: SearchResponse): Product[] => {
  return data.hits.hits.map((hit: Hit) => mapProductWithVariants(Array(hit._source as ProductSourceResponse)))
}

/**
 * Maps results from search for seriesId into one product with all variants
 */
export const mapProductFromSeriesId = (data: SearchResponse): Product => {
  return mapProductWithVariants(data.hits.hits.map((h) => h._source as ProductSourceResponse))
}

/**
 * Maps result from indexed _doc endpoint into one product with one variant (indexed on productvariants)
 */
export const mapProductFromDoc = (data: ProductDocResponse): Product => {
  return mapProductWithVariants(Array(data._source))
}

function filterUniqueCombinationsOfPostAndRank(agreementInfos: AgreementInfo[]): AgreementInfo[] {
  const groupedByAgreementId: Map<string, Map<string, AgreementInfo>> = new Map()

  // Group AgreementInfo objects by agreement.id and postNr
  for (const agreementInfo of agreementInfos) {
    const agreementId = agreementInfo.id
    const postNr = agreementInfo.postNr

    if (!groupedByAgreementId.has(agreementId)) {
      groupedByAgreementId.set(agreementId, new Map())
    }

    const groupByPostNr = groupedByAgreementId.get(agreementId)!

    // Check if the combination already exists for the current agreement.id
    const key = `${postNr}-${agreementInfo.rank}`
    if (!groupByPostNr.has(key)) {
      groupByPostNr.set(key, agreementInfo)
    }
  }

  // Flatten the map values back to an array
  const uniqueCombinations: AgreementInfo[] = []
  groupedByAgreementId.forEach((groupByPostNr) => {
    uniqueCombinations.push(...Array.from(groupByPostNr.values()))
  })

  return uniqueCombinations
}

/**
 * Maps results from search with aggregation into products with all variants
 */
export const mapProductsFromAggregation = (data: SeriesAggregationResponse): Product[] => {
  const buckets = data.aggregations.series_buckets.buckets.map((bucket: BucketResponse) =>
    mapProductWithVariants(bucket.products.hits.hits.map((h) => h._source as ProductSourceResponse))
  )
  return buckets
}

export const mapProductWithVariants = (sources: ProductSourceResponse[]): Product => {
  const variants = sources.map((source) => {
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
  const allAgreementsForAllVariants = variants.flatMap((variant) => variant.agreements)
  const uniquesAgreementsPostAndRanks = filterUniqueCombinationsOfPostAndRank(allAgreementsForAllVariants)

  return {
    id: firstVariant.seriesId,
    title: firstVariant.title,
    attributes: { ...firstVariant.attributes, commonCharacteristics },
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
    agreements: uniquesAgreementsPostAndRanks,
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
    agreements: mapAgreementInfo(source.agreements),
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

export const mapDocuments = (media: MediaResponse[]): Document[] => {
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
      updated: new Date(Date.parse(doc.updated)) ?? '',
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

const mapAgreementInfo = (data: AgreementInfoResponse[]): AgreementInfo[] => {
  return data.map((agreement) => {
    return {
      id: agreement.id,
      identifier: agreement.identifier,
      title: agreement.title,
      postNr: agreement.postNr,
      postTitle: getPostTitle(agreement.postTitle),
      rank: agreement.rank,
      expired: agreement.expired,
    }
  })
}
const sortOptions = [
  { value: { articleName_keyword: 'asc' }, label: 'Alfabetisk' },
  { value: [{ 'agreementInfo.rank': 'asc' }, { 'agreements.postNr': 'asc' }], label: 'Avtale_rangering' },
  { value: [{ _score: { order: 'desc' } }], label: 'Beste_treff' },
  { value: { created: 'desc' }, label: 'Nyeste' },
  { value: { updated: 'desc' }, label: 'Sist_modifisert' },
]

export const mapProductSearchParams = (searchParams: ReadonlyURLSearchParams): SearchData => {
  const sortOrderString = searchParams.get('sortering') ?? ''
  const sortOrderOption = sortOptions.find((option) => option.label === sortOrderString)
  const sortOrder = sortOrderOption?.value || { articleName_keyword: 'asc' }
  const searchTerm = searchParams.get('term') ?? ''
  const isoCode = searchParams.get('isoCode') ?? ''
  const hasAgreementsOnly = searchParams.has('agreement')

  const filterKeys = Object.keys(FilterCategories).filter((filter) => searchParams?.has(filter))

  const filters = filterKeys.reduce(
    (obj, fk) => ({
      ...obj,
      [fk]: searchParams?.getAll(fk),
    }),
    {}
  )

  return {
    sortOrder,
    searchTerm,
    isoCode,
    hasAgreementsOnly,
    filters: { ...initialSearchDataState.filters, ...filters },
  }
}

export const toSearchQueryString = (searchParams: SearchData) =>
  queryString.stringify({
    ...(searchParams.sortOrder && { sortering: searchParams.sortOrder }),
    // ...(searchParams.sortOrder && { sortering: searchParams.sortOrder }),
    ...(searchParams.hasAgreementsOnly ? { agreement: '' } : {}),
    ...(searchParams.searchTerm && { term: searchParams.searchTerm }),
    ...(searchParams.isoCode && { isoCode: searchParams.isoCode }),
    ...Object.entries(searchParams.filters)
      .filter(([_, values]) => values.some((value) => value))
      .reduce((newObject, [key, values]) => ({ ...newObject, [key]: values }), {} as SelectedFilters),
  })
