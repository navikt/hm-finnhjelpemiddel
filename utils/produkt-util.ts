export interface Produkt {
  id: number
  tittel: string
  description?: {
    name?: string
    beskrivelse?: string
    tilleggsinfo?: string
  }
  isoKode: string
  accessory: boolean
  sparepart: boolean
  hmsNr?: string
  tekniskData: TekniskData[]
  photos: Photo[]
  supplierId: number
  seriesId: string
}

export interface Photo {
  uri: string
}

export interface TekniskData {
  key: string
  value: string
  unit: string
}

export const createProduct = (_source?: any): Produkt => {
  return {
    id: _source.id,
    tittel: _source.title,
    description: {
      name: _source.description?.name,
      tilleggsinfo: _source.description?.shortDescription,
      beskrivelse: _source.description?.text,
    },
    isoKode: _source.isoCategory,
    accessory: _source.accessory,
    sparepart: _source.sparepart,
    hmsNr: _source.hmsartNr,
    tekniskData: mapTekniskInfo(_source.data),
    photos: mapPhotoInfo(_source.media),
    supplierId: _source.supplier?.id,
    seriesId: _source.seriesId,
  }
}

const mapPhotoInfo = (media: any): Photo[] => {
  return media
    .filter((media: any) => media.type == 'IMAGE' && media.order && media.uri)
    .sort((a: any, b: any) => a.order - b.order)
    .map((image: any) => ({
      uri: image.uri,
    }))
}

const mapTekniskInfo = (data: any): TekniskData[] => {
  return data
    .filter((data: any) => data.key && data.value)
    .map((data: any) => ({
      key: data.key,
      value: data.value,
      unit: data.unit,
    }))
}

export const mapProducts = (data: any): Produkt[] => {
  return data.hits.hits.map((hit: any) => {
    const produkt = createProduct(hit._source)
    return produkt
  })
}
