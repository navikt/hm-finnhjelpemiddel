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
  techData: TechData[]
  techDataDict: TechData2
  photos: Photo[]
  supplierId: number
  seriesId: string
}

export interface Photo {
  uri: string
}

export interface TechData {
  key: string
  value: string
  unit: string
}

export interface TechData2 {
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
    techData: mapTechData(_source.data),
    techDataDict: mapTechDataDict(_source.data),
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

const mapTechData = (data: any): TechData[] => {
  return data
    .filter((data: any) => data.key && data.value)
    .map((data: any) => ({
      key: data.key,
      value: data.value,
      unit: data.unit,
    }))
}

const mapTechDataDict = (data: any): TechData2 => {
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
