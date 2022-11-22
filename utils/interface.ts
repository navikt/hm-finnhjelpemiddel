export interface Produkt {
  id: number
  tittel: string
  modell?: {
    navn?: string
    beskrivelse?: string
    tilleggsinfo?: string
  }
  isoKode: string
  tilbehor?: boolean
  del?: boolean
  hmsNr?: string
  tekniskData?: [{ key: string; value: string; unit?: string }]
  bilder?: Bilde[]
}

export interface Bilde {
  order: number
  url: string
}

export const opprettProdukt = (_source?: any): Produkt => {
  return {
    id: _source.id,
    tittel: _source.title,
    modell: {
      navn: _source.description?.modelName,
      tilleggsinfo: _source.description?.modelDescription,
      beskrivelse: _source.description?.text,
    },
    isoKode: _source.isoCategory,
    tilbehor: _source.accessory,
    del: _source.part,
    hmsNr: _source.hmsartNr,
    tekniskData: _source.data,
    bilder: opprettBildeinfo(_source.media),
  }
}

const opprettBildeinfo = (media: any): [{ order: number; url: string }] => {
  return media
    .filter((image: any) => image.order && image.uri)
    .map((image: any) => ({
      order: image.order,
      url: image.uri,
    }))
}

export const opprettProdukter = (data: any): Produkt[] => {
  return data.hits.hits.map((hit: any) => {
    const produkt = opprettProdukt(hit._source)
    return produkt
  })
}
