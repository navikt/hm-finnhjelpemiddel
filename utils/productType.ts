export interface Produkt {
  id: number
  tittel?: string
  modell?: {
    navn?: string
    beskrivelse?: string
    tilleggsinfo?: string
  }
  isoKode?: string
  tilbehør?: boolean
  del?: boolean
  hmsNr?: string
  tekniskData?: [{ key: string; value: string; unit?: string }]
}
