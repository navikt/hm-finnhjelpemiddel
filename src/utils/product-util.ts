import { FilterCategories } from './filter-util'
import {
  Hit,
  MediaResponse,
  MediaType,
  ProductSourceResponse,
  SearchResponse,
  TechDataResponse,
} from './response-types'
import { initialSearchDataState } from './state-util'

export interface Product {
  id: string
  title: string
  attributes: Attributes
  techData: TechData
  hmsartNr: string | null
  supplierRef: string
  isoCategory: string
  accessory: boolean
  sparepart: boolean
  photos: Photo[]
  seriesId: string | null
}

export interface Photo {
  uri: string
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

export const createProduct = (source: ProductSourceResponse): Product => {
  return {
    id: source.id,
    title: source.title,
    attributes: source.attributes,
    techData: mapTechDataDict(source.data),
    hmsartNr: source.hmsartNr,
    supplierRef: source.supplier?.id,
    isoCategory: source.isoCategory,
    accessory: source.accessory,
    sparepart: source.sparepart,
    photos: mapPhotoInfo(source.media),
    seriesId: source.seriesId,
  }
}

const mapPhotoInfo = (media: MediaResponse[]): Photo[] => {
  const seen: { [uri: string]: boolean } = {}
  const photos: Photo[] = media
    .filter((media: MediaResponse) => {
      if (!(media.type == MediaType.IMAGE && media.order && media.uri) || seen[media.uri]) {
        return false
      }

      seen[media.uri] = true
      return true
    })
    .sort((a: MediaResponse, b: MediaResponse) => a.order - b.order)
    .map((image: MediaResponse) => ({
      uri: image.uri,
    }))

  return photos
}

const mapTechDataDict = (data: Array<TechDataResponse>): TechData => {
  return Object.assign(
    {},
    ...data
      .filter((data: TechDataResponse) => data.key && data.value)
      .map((data: TechDataResponse) => ({ [data.key]: { value: data.value, unit: data.unit } }))
  )
}

export const mapProducts = (data: SearchResponse): Product[] => {
  return data.hits.hits.map((hit: Hit) => createProduct(hit._source))
}

export const mapProductSearchParams = (searchParams: { [key: string]: any }) => {
  const searchTerm = searchParams.term ?? ''
  const isoCode = searchParams.isoCode ?? ''
  const hasRammeavtale = searchParams.agreement ? searchParams.agreement === 'true' : true

  const filterKeys = Object.keys(FilterCategories).filter((filter) =>
    Array.from(Object.keys(searchParams)).includes(filter)
  )

  const filters = filterKeys.reduce((obj, fk) => ({ ...obj, [fk]: searchParams[fk] }), {})

  return {
    searchTerm,
    isoCode,
    hasRammeavtale,
    filters: { ...initialSearchDataState.filters, ...filters },
  }
}
