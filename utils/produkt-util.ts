export interface Produkt {
  id: number
  tittel: string
  modell?: {
    navn?: string
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
}

export interface Photo {
  uri: string
}

export interface TekniskData {
  key: string
  value: string
}

export const opprettProdukt = (_source?: any): Produkt => {
  return {
    id: _source.id,
    tittel: _source.title,
    modell: {
      navn: _source.description?.name,
      tilleggsinfo: _source.description?.shortDescription,
      beskrivelse: _source.description?.text,
    },
    isoKode: _source.isoCategory,
    accessory: _source.accessory,
    sparepart: _source.sparepart,
    hmsNr: _source.hmsartNr,
    tekniskData: opprettTekniskInfo(_source.data),
    photos: createPhotoInfo(_source.media),
    supplierId: _source.supplier?.id,
  }
}

const createPhotoInfo = (media: any): Photo[] => {
  return media
    .filter((media: any) => media.type == 'IMAGE' && media.order && media.uri)
    .sort((a: any, b: any) => a.order - b.order)
    .map((image: any) => ({
      uri: image.uri,
    }))
}

const opprettTekniskInfo = (data: any): TekniskData[] => {
  return data
    .filter((data: any) => data.key && data.value)
    .map((data: any) => ({
      key: data.key,
      value: data.unit ? data.value + ' ' + data.unit : data.value,
    }))
}

export const opprettProdukter = (data: any): Produkt[] => {
  return data.hits.hits.map((hit: any) => {
    const produkt = opprettProdukt(hit._source)
    return produkt
  })
}
