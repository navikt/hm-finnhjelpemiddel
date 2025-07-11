import {
  AgreementInfoResponse,
  CompatibleWithResponse,
  Hit,
  MediaResponse,
  ProductSourceResponse,
  SearchResponse,
  SeriesAggregationResponse,
  SeriesBucketResponse,
  TechDataResponse,
} from './response-types'
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
  isoCategoryTitleInternational: string
  isoCategoryText: string
  accessory: boolean
  sparePart: boolean
  photos: Photo[]
  videos: Video[]
  documents: Document[]
  supplierId: string
  supplierName: string
  agreements: AgreementInfo[]
  main: boolean
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
  status: 'INACTIVE' | 'ACTIVE'
  hmsArtNr: string | null
  supplierRef: string
  supplierName: string | null
  articleName: string
  techData: TechData
  hasAgreement: boolean
  filters: { [key: string]: string | number }
  expired: string
  agreements: AgreementInfo[]
  bestillingsordning: boolean
  digitalSoknad: Boolean
  accessory: boolean
  sparePart: boolean
  /** expired from backend is a Date data field like 2043-06-01T14:19:30.505665648*/
}

export interface Photo {
  uri: string
}

export interface Video {
  uri: string
  text?: string
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
  compatibleWith?: CompatibleWith
  url?: string
}

interface CompatibleWith {
  seriesIds: string[]
  productIds: string[]
}

export interface AgreementInfo {
  id: string
  identifier: string
  title: string
  rank: number
  postNr: number
  refNr: string | null
  postTitle: string | null
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
  if (data.hits.hits.map((h) => h._source as ProductSourceResponse).length === 0) {
    throw new Error(`ProductSourceResponse array is empty. Cannot map product with variants ${JSON.stringify(data)}`)
  }
  return mapProductWithVariants(data.hits.hits.map((h) => h._source as ProductSourceResponse))
}

/**
 * Maps results from search for hmsArtNr into one product with the specified variant
 */
export const mapProductFromHmsArtNr = (data: SearchResponse, hmsArtNr: String): Product => {
  if (data.hits.hits.map((h) => h._source as ProductSourceResponse).length === 0) {
    throw new Error(`ProductSourceResponse array is empty. Cannot map product with variants ${JSON.stringify(data)}`)
  }
  return mapProductWithOneVariant(
    data.hits.hits.map((h) => h._source as ProductSourceResponse),
    hmsArtNr
  )
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
  return data.aggregations.series_buckets.buckets.map((bucket: SeriesBucketResponse) =>
    mapProductWithVariants(bucket.products.hits.hits.map((h) => h._source as ProductSourceResponse))
  )
}

export const mapProductsVariants = (data: SearchResponse): ProductVariant[] => {
  const sources = data.hits.hits.map((h) => h._source as ProductSourceResponse)

  return sources.map((source) => {
    return mapProductVariant(source)
  })
}

export const mapProductsWithoutAggregationOnSeries = (data: SearchResponse): Product[] => {
  const sources = data.hits.hits.map((h) => h._source as ProductSourceResponse)
  return mapProductWithNoAggregation(sources)
}

export const mapProductWithNoAggregation = (sources: ProductSourceResponse[]): Product[] => {
  if (sources.length === 0) {
    throw new Error('ProductSourceResponse array is empty. Cannot map product with variants')
  }

  return sources.map((product): Product => {
    return {
      id: product.seriesId,
      title: product.title,
      attributes: {
        manufacturer: product.attributes.manufacturer,
        articlename: product.attributes.articlename,
        series: product.attributes.series,
        shortdescription: product.attributes.shortdescription,
        text: product.attributes.text,
        compatibleWith: product.attributes.compatibleWith
          ? mapCompatibleWith(product.attributes.compatibleWith)
          : undefined,
        url: product.attributes.url,
      },
      variantCount: 1,
      variants: [mapProductVariant(product)],
      compareData: {
        techDataRange: {},
        agreementRank: null,
      },
      isoCategory: product.isoCategory,
      isoCategoryTitle: product.isoCategoryTitle,
      isoCategoryTitleInternational: product.isoCategoryTitleInternational,
      isoCategoryText: product.isoCategoryText,
      accessory: product.accessory,
      sparePart: product.sparePart,
      photos: mapPhotoInfo(product.media),
      videos: mapVideoInfo(product.media),
      documents: mapDocuments(product.media),
      supplierId: product.supplier?.id ?? '',
      supplierName: product.supplier?.name ?? '',
      agreements: product.agreements,
      main: product.main,
    }
  })
}
export const mapProductWithOneVariant = (sources: ProductSourceResponse[], hmsArtNr: String): Product => {
  const variant = sources
    .filter((source) => source.hmsArtNr === hmsArtNr)
    .map((source) => {
      return mapProductVariant(source)
    })

  if (sources.length === 0) {
    throw new Error('ProductSourceResponse array is empty. Cannot map product with variants')
  }

  const firstVariant = sources[0]
  const allAgreementsForAllVariants = variant.flatMap((variant) => variant.agreements)
  const uniquesAgreementsPostAndRanks = filterUniqueCombinationsOfPostAndRank(allAgreementsForAllVariants)

  return {
    id: firstVariant.seriesId,
    title: firstVariant.title,
    attributes: {
      manufacturer: firstVariant.attributes.manufacturer,
      articlename: firstVariant.attributes.articlename,
      series: firstVariant.attributes.series,
      shortdescription: firstVariant.attributes.shortdescription,
      text: firstVariant.attributes.text,
      compatibleWith: firstVariant.attributes.compatibleWith
        ? mapCompatibleWith(firstVariant.attributes.compatibleWith)
        : undefined,
      url: firstVariant.attributes.url,
    },
    variantCount: sources.length,
    variants: variant,
    compareData: {
      techDataRange: {},
      agreementRank: null,
    },
    isoCategory: firstVariant.isoCategory,
    isoCategoryTitle: firstVariant.isoCategoryTitle,
    isoCategoryText: firstVariant.isoCategoryText,
    isoCategoryTitleInternational: firstVariant.isoCategoryTitleInternational,
    accessory: firstVariant.accessory,
    sparePart: firstVariant.sparePart,
    photos: mapPhotoInfo(firstVariant.media),
    videos: mapVideoInfo(firstVariant.media),
    documents: mapDocuments(firstVariant.media),
    supplierId: firstVariant.supplier?.id ?? '',
    supplierName: firstVariant.supplier?.name ?? '',
    agreements: uniquesAgreementsPostAndRanks,
    main: firstVariant.main,
  }
}

export const mapProductWithVariants = (sources: ProductSourceResponse[]): Product => {
  const variants = sources.map((source) => {
    return mapProductVariant(source)
  })

  if (sources.length === 0) {
    throw new Error('ProductSourceResponse array is empty. Cannot map product with variants')
  }

  // TODO: Should we use the first variant? Values should be the same but should we check that they are?
  const firstVariant = sources[0]
  const allAgreementsForAllVariants = variants.flatMap((variant) => variant.agreements)
  const uniquesAgreementsPostAndRanks = filterUniqueCombinationsOfPostAndRank(allAgreementsForAllVariants)

  return {
    id: firstVariant.seriesId,
    title: firstVariant.title,
    attributes: {
      manufacturer: firstVariant.attributes.manufacturer,
      articlename: firstVariant.attributes.articlename,
      series: firstVariant.attributes.series,
      shortdescription: firstVariant.attributes.shortdescription,
      text: firstVariant.attributes.text,
      compatibleWith: firstVariant.attributes.compatibleWith
        ? mapCompatibleWith(firstVariant.attributes.compatibleWith)
        : undefined,
      url: firstVariant.attributes.url,
    },
    variantCount: sources.length,
    variants: variants,
    compareData: {
      techDataRange: {},
      agreementRank: null,
    },
    isoCategory: firstVariant.isoCategory,
    isoCategoryTitle: firstVariant.isoCategoryTitle,
    isoCategoryText: firstVariant.isoCategoryText,
    isoCategoryTitleInternational: firstVariant.isoCategoryTitleInternational,
    accessory: firstVariant.accessory,
    sparePart: firstVariant.sparePart,
    photos: mapPhotoInfo(firstVariant.media),
    videos: mapVideoInfo(firstVariant.media),
    documents: mapDocuments(firstVariant.media),
    supplierId: firstVariant.supplier?.id ?? '',
    supplierName: firstVariant.supplier?.name ?? '',
    agreements: uniquesAgreementsPostAndRanks,
    main: firstVariant.main,
  }
}

export const mapProductVariant = (source: ProductSourceResponse): ProductVariant => {
  return {
    id: source.id,
    status: source.status,
    hmsArtNr: source.hmsArtNr,
    supplierRef: source.supplierRef,
    supplierName: source.supplier.name || '',
    articleName: source.articleName,
    techData: mapTechDataDict(source.data),
    hasAgreement: source.hasAgreement,
    agreements: mapAgreementInfo(source.agreements),
    filters: source.filters,
    expired: source.expired,
    bestillingsordning: source.attributes.bestillingsordning || false,
    digitalSoknad: source.attributes.digitalSoknad || false,
    accessory: source.accessory,
    sparePart: source.sparePart,
    /** expired from backend is a Date data field like 2043-06-01T14:19:30.505665648 */
  }
}

const mapPhotoInfo = (media: MediaResponse[]): Photo[] => {
  const seen: { [uri: string]: boolean } = {}
  return media
    .filter((media: MediaResponse) => {
      if (!(media.type === 'IMAGE' && media.uri) || seen[media.uri]) {
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

const mapVideoInfo = (media: MediaResponse[]): Video[] => {
  const seen: { [uri: string]: boolean } = {}
  return media
    .filter((media: MediaResponse) => {
      if (!(media.type === 'VIDEO' && media.source === 'EXTERNALURL' && media.uri) || seen[media.uri]) {
        return false
      }

      seen[media.uri] = true
      return true
    })
    .sort((a: MediaResponse, b: MediaResponse) => a.priority - b.priority)
    .map((video: MediaResponse) => ({
      uri: video.uri,
      text: video.text || '',
    }))
}

export const mapCompatibleWith = (compatibleWith: CompatibleWithResponse): CompatibleWith => {
  return {
    seriesIds: compatibleWith.seriesIds,
    productIds: compatibleWith.productIds,
  }
}

export const mapDocuments = (media: MediaResponse[]): Document[] => {
  const seen: { [uri: string]: boolean } = {}
  return media
    .filter((media: MediaResponse) => {
      if (!(media.type === 'PDF' && media.text && media.uri) || seen[media.uri]) {
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
      .map((data: TechDataResponse) => ({ [data.key]: { value: capitalize(data.value), unit: data.unit } }))
  )
}

const mapAgreementInfo = (data: AgreementInfoResponse[]): AgreementInfo[] => {
  return data.map((agreement) => {
    return {
      id: agreement.id,
      identifier: agreement.identifier,
      title: agreement.title,
      postNr: agreement.postNr,
      refNr: agreement.refNr,
      postTitle: agreement.postTitle,
      rank: agreement.rank,
      expired: agreement.expired,
    }
  })
}

export function containsHTML(input: string | undefined): boolean {
  if (!input) {
    return false
  }
  const htmlRegex = /<[^>]*>/
  return htmlRegex.test(input)
}

export function validateHTML(input: string | undefined): boolean {
  if (!input) {
    return false
  }
  const allowedTagsRegex = /<\/?(p|br|em|strong|italic|ul|li|ol|a)[^>]*>/gi
  const allTagsRegex = /<\/?[^>]+(>|$)/g

  const allowedTags = input.match(allowedTagsRegex) || []
  const allTags = input.match(allTagsRegex) || []

  return allowedTags.length === allTags.length
}
