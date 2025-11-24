import { WheelchairIcon } from '@navikt/aksel-icons'
import { JSX } from 'react'

export type KategoriNavn =
  | 'Alle'
  | 'Bevegelse'
  | 'Rullestoler'
  | 'MRS'
  | 'Ganghjelpemidler'
  | 'Forflytning'
  | 'Sykler'
  | 'Kjelker og akebrett'
  | 'Vogner'
  | 'Bilseter og bilutstyr'
  | 'ERS'
  | 'Motoriserte kjøretøy'
  | 'Drivaggregat'
  | 'Tilleggsutstyr'

export type Kategorier = {
  [key in KategoriNavn]: Kategori
}

export type Kategori = {
  navn: KategoriNavn
  beskrivelse: string
  underkategorier: KategoriNavn[]
  isoer: string[]
  visProdukter: boolean
  ikon?: JSX.Element | undefined
}

export const alle: Kategori = {
  navn: 'Alle',
  beskrivelse: 'Dette er alle hjelpemidlene, her kommer du til søket',
  underkategorier: [],
  isoer: [],
  visProdukter: true,
}

export const bevegelse: Kategori = {
  navn: 'Bevegelse',
  beskrivelse: 'Bevegelse og sånt',
  underkategorier: [
    'Ganghjelpemidler',
    'Rullestoler',
    'Forflytning',
    'Sykler',
    'Kjelker og akebrett',
    'Vogner',
    'Bilseter og bilutstyr',
  ],
  isoer: [],
  visProdukter: false,
}

export const rullestoler: Kategori = {
  navn: 'Rullestoler',
  beskrivelse: 'Rulling',
  underkategorier: ['MRS', 'ERS', 'Motoriserte kjøretøy', 'Drivaggregat', 'Tilleggsutstyr'],
  isoer: [],
  visProdukter: false,
  ikon: <WheelchairIcon fontSize={'5rem'} aria-hidden />,
}

export const mrs: Kategori = {
  navn: 'MRS',
  beskrivelse: 'Manuel',
  underkategorier: [],
  isoer: ['1222', '122704'],
  visProdukter: true,
}

export const ganghjelpemidler: Kategori = {
  navn: 'Ganghjelpemidler',
  beskrivelse: 'hei',
  underkategorier: [],
  isoer: [],
  visProdukter: true,
}
export const forflytning: Kategori = {
  navn: 'Forflytning',
  beskrivelse: '',
  underkategorier: [],
  isoer: [],
  visProdukter: false,
}
export const sykler: Kategori = {
  navn: 'Sykler',
  beskrivelse: '',
  underkategorier: [],
  isoer: [],
  visProdukter: false,
}
export const kjelkerOgAkebrett: Kategori = {
  navn: 'Kjelker og akebrett',
  beskrivelse: '',
  underkategorier: [],
  isoer: [],
  visProdukter: false,
}
export const vogner: Kategori = {
  navn: 'Vogner',
  beskrivelse: '',
  underkategorier: [],
  isoer: [],
  visProdukter: false,
}
export const bilseterOgBilutstyr: Kategori = {
  navn: 'Bilseter og bilutstyr',
  beskrivelse: '',
  underkategorier: [],
  isoer: [],
  visProdukter: false,
}
export const ers: Kategori = {
  navn: 'ERS',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['1223'],
  visProdukter: true,
}

export const motoriserteKjoretoy: Kategori = {
  navn: 'Motoriserte kjøretøy',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121709'],
  visProdukter: true,
}

export const drivaggregat: Kategori = {
  navn: 'Drivaggregat',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['122409'],
  visProdukter: true,
}
export const tilleggsutstyr: Kategori = {
  navn: 'Tilleggsutstyr',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['1224'],
  visProdukter: true,
}

export const kategorier: Kategorier = {
  Alle: alle,
  'Bilseter og bilutstyr': bilseterOgBilutstyr,
  'Kjelker og akebrett': kjelkerOgAkebrett,
  'Motoriserte kjøretøy': motoriserteKjoretoy,
  Drivaggregat: drivaggregat,
  ERS: ers,
  Forflytning: forflytning,
  Ganghjelpemidler: ganghjelpemidler,
  Sykler: sykler,
  Tilleggsutstyr: tilleggsutstyr,
  Vogner: vogner,
  Bevegelse: bevegelse,
  Rullestoler: rullestoler,
  MRS: mrs,
}
