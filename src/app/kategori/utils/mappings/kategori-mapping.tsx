import { JSX } from 'react'
import {
  belterOgStøtteselerBil,
  bevegelse,
  bilseter,
  bilseterOgBilutstyr,
  drivaggregat,
  endreKroppsstilling,
  elektriskeRullestoler,
  forflytning,
  ganghjelpemidler,
  gåbord,
  gåstativer,
  gåstoler,
  hjulsparkOgSparkesykler,
  KategoriBevegelseNavn,
  kjelkerOgAkebrett,
  krykkerOgStokker,
  letteInnOgUtstigningBil,
  mobilePersonløftere,
  motoriserteKjøretøy,
  manuelleRullestoler,
  personløftere,
  ramperForBil,
  rullatorer,
  rullestoler,
  seilOgSeler,
  stasjonærePersonløftere,
  sykler,
  tandemsykler,
  utstyrTilRullestoler,
  tilleggsutstyrSykler,
  tilleggsutstyrTilGanghjelpemidler,
  tohjulssykler,
  trappeklatrere,
  trehjulssykler,
  vogner,
  sittesystem,
  ramper,
  løfteplattformer,
  heiser,
  ramperOgHeiserOgLøfteplattformer,
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
  'Ramper, heiser og løfteplattformer': ramperOgHeiserOgLøfteplattformer,
  Heiser: heiser,
  Løfteplattformer: løfteplattformer,
  Ramper: ramper,
  Sittesystem: sittesystem,
  'Krykker og stokker': krykkerOgStokker,
  'Tilleggsutstyr til ganghjelpemidler': tilleggsutstyrTilGanghjelpemidler,
  Gåbord: gåbord,
  Gåstativer: gåstativer,
  Gåstoler: gåstoler,
  Rullatorer: rullatorer,
  'Belter og støtteseler for bil': belterOgStøtteselerBil,
  Bilseter: bilseter,
  'Lette inn- og utstigning av bil': letteInnOgUtstigningBil,
  'Ramper for bil': ramperForBil,
  'Hjulspark og sparkesykler': hjulsparkOgSparkesykler,
  'Tilleggsutstyr til sykler': tilleggsutstyrSykler,
  Trehjulssykler: trehjulssykler,
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
  'Elektriske rullestoler': elektriskeRullestoler,
  Forflytning: forflytning,
  Ganghjelpemidler: ganghjelpemidler,
  Sykler: sykler,
  'Utstyr til rullestoler': utstyrTilRullestoler,
  Vogner: vogner,
  Bevegelse: bevegelse,
  Rullestoler: rullestoler,
  'Manuelle rullestoler': manuelleRullestoler,
}
