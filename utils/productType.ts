export interface Produkt {
  id: number
  tittel?: string
  modell?: {
    navn?: string
    beskrivelse?: string
    hmm?: string
  }
  isoKode?: number
  tilbehør?: boolean
  del?: boolean
}
