import { FilterCategories } from '../app/FilterView'
import { initialSearchDataState } from './state-util'

export interface Product {
  id: number
  title: string
  description?: {
    name?: string
    short?: string
    additional?: string
  }
  isoCode: string
  accessory: boolean
  sparepart: boolean
  hmsNr?: string
  techData: TechData
  photos: Photo[]
  supplierId: number
  seriesId: string
}

export interface Photo {
  uri: string
}

export interface TechData {
  [key: string]: { value: string; unit: string }
}

export const createProduct = (_source?: any): Product => {
  return {
    id: _source.id,
    title: _source.title,
    description: {
      name: _source.description?.name,
      additional: _source.description?.shortDescription,
      short: _source.description?.text,
    },
    isoCode: _source.isoCategory,
    accessory: _source.accessory,
    sparepart: _source.sparepart,
    hmsNr: _source.hmsartNr,
    techData: mapTechDataDict(_source.data),
    photos: mapPhotoInfo(_source.media),
    supplierId: _source.supplier?.id,
    seriesId: _source.seriesId,
  }
}

const mapPhotoInfo = (media: any): Photo[] => {
  const seen: { [uri: string]: boolean } = {}
  const photos: Photo[] = media
    .filter((media: any) => {
      if (!(media.type == 'IMAGE' && media.order && media.uri) || seen[media.uri]) {
        return false
      }

      seen[media.uri] = true
      return true
    })
    .sort((a: any, b: any) => a.order - b.order)
    .map((image: any) => ({
      uri: image.uri,
    }))

  return photos
}

const mapTechDataDict = (data: any): TechData => {
  return Object.assign(
    {},
    ...data
      .filter((data: any) => data.key && data.value)
      .map((data: any) => ({ [data.key]: { value: data.value, unit: data.unit } }))
  )
}

export const mapProducts = (data: any): Product[] => {
  return data.hits.hits.map((hit: any) => createProduct(hit._source))
}

export const mapProductSearchParams = (searchParams: URLSearchParams) => {
  const searchTerm = searchParams.get('term') ?? ''
  const isoCode = searchParams.get('isoCode') ?? ''
  const hasRammeavtale = searchParams.get('agreement') ? searchParams.get('agreement') === 'true' : true

  const filterKeys = Object.keys(FilterCategories).filter((filter) => Array.from(searchParams.keys()).includes(filter))
  const filters = filterKeys.reduce((obj, fk) => ({ ...obj, [fk]: searchParams.getAll(fk) }), {})

  return {
    searchTerm,
    isoCode,
    hasRammeavtale,
    filters: { ...initialSearchDataState.filters, ...filters },
  }
}
