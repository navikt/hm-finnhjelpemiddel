import { JSX } from 'react'
import {
  belterOgStøtteselerBil,
  bevegelse,
  bilseterOgBilputer,
  bilseterOgBilutstyr,
  drivaggregat,
  endreKroppsstilling,
  ers,
  forflytning,
  ganghjelpemidler,
  gåbord,
  gåstativer,
  gåstoler,
  hjulsparkOgSparkesykler,
  KategoriBevegelseNavn,
  kjelkerOgAkebrett,
  krykkerOgStokkerOgStaver,
  letteInnOgUtstigningBil,
  mobilePersonløftere,
  motoriserteKjøretøy,
  mrs,
  personløftere,
  ramperForBil,
  rullatorer,
  rullestoler,
  seilOgSeler,
  stasjonærePersonløftere,
  sykler,
  tandemsykler,
  tilleggsutstyrRullestoler,
  tilleggsutstyrSykler,
  tilleggsutstyrTilGanghjelpemidler,
  tohjulssykler,
  trappeklatrere,
  treOgFirehjulssykler,
  vogner,
} from '@/app/kategori/utils/mappings/kategori-bevegelse-mapping'

export type KategoriNavn = KategoriBevegelseNavn | 'Alle' | 'Bevegelse'

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
  beskrivelse: 'Se alle hjelpemidler på søkesiden',
  underkategorier: [],
  isoer: [],
  visProdukter: true,
}

export const kategorier: Kategorier = {
  'Krykker, stokker og staver': krykkerOgStokkerOgStaver,
  'Tilleggsutstyr til ganghjelpemidler': tilleggsutstyrTilGanghjelpemidler,
  Gåbord: gåbord,
  Gåstativer: gåstativer,
  Gåstoler: gåstoler,
  Rullatorer: rullatorer,
  'Belter og støtteseler for bil': belterOgStøtteselerBil,
  'Bilseter og bilputer': bilseterOgBilputer,
  'Lette inn- og utstigning av bil': letteInnOgUtstigningBil,
  'Ramper for bil': ramperForBil,
  'Hjulspark og sparkesykler': hjulsparkOgSparkesykler,
  'Tilleggsutstyr til sykler': tilleggsutstyrSykler,
  'Tre- og firehjulssykler': treOgFirehjulssykler,
  Tandemsykler: tandemsykler,
  Tohjulssykler: tohjulssykler,
  'Hjelpemidler for å endre kroppsstilling': endreKroppsstilling,
  'Mobile personløftere': mobilePersonløftere,
  'Seil og seler': seilOgSeler,
  'Stasjonære personløftere': stasjonærePersonløftere,
  Personløftere: personløftere,
  Trappeklatrere: trappeklatrere,
  Alle: alle,
  'Bilseter og bilutstyr': bilseterOgBilutstyr,
  'Kjelker og akebrett': kjelkerOgAkebrett,
  'Motoriserte kjøretøy': motoriserteKjøretøy,
  Drivaggregat: drivaggregat,
  ERS: ers,
  Forflytning: forflytning,
  Ganghjelpemidler: ganghjelpemidler,
  Sykler: sykler,
  'Tilleggsutstyr til rullestoler': tilleggsutstyrRullestoler,
  Vogner: vogner,
  Bevegelse: bevegelse,
  Rullestoler: rullestoler,
  MRS: mrs,
}
