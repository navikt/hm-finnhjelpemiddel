import { Kategori } from '@/app/kategori/utils/mappings/kategori-mapping'
import { WheelchairIcon } from '@navikt/aksel-icons'

export type KategoriBevegelseNavn =
  | 'Rullestoler'
  | 'Manuelle rullestoler'
  | 'Ganghjelpemidler'
  | 'Forflytning'
  | 'Sykler'
  | 'Kjelker og akebrett'
  | 'Vogner'
  | 'Bilseter og bilutstyr'
  | 'Elektriske rullestoler'
  | 'Motoriserte kjøretøy'
  | 'Drivaggregat'
  | 'Tilleggsutstyr til rullestoler'
  | 'Trappeklatrere'
  | 'Hjelpemidler for å endre kroppsstilling'
  | 'Personløftere'
  | 'Stasjonære personløftere'
  | 'Mobile personløftere'
  | 'Seil og seler'
  | 'Tandemsykler'
  | 'Tohjulssykler'
  | 'Tre- og firehjulssykler'
  | 'Hjulspark og sparkesykler'
  | 'Tilleggsutstyr til sykler'
  | 'Bilseter og bilputer'
  | 'Lette inn- og utstigning av bil'
  | 'Belter og støtteseler for bil'
  | 'Ramper for bil'
  | 'Krykker, stokker og staver'
  | 'Gåstativer'
  | 'Rullatorer'
  | 'Gåstoler'
  | 'Gåbord'
  | 'Tilleggsutstyr til ganghjelpemidler'

export const bevegelse: Kategori = {
  navn: 'Bevegelse',
  beskrivelse: '',
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
  beskrivelse: '',
  underkategorier: [
    'Manuelle rullestoler',
    'Elektriske rullestoler',
    'Motoriserte kjøretøy',
    'Drivaggregat',
    'Tilleggsutstyr til rullestoler',
  ],
  isoer: [],
  visProdukter: false,
  ikon: <WheelchairIcon fontSize={'5rem'} aria-hidden />,
}

export const manuelleRullestoler: Kategori = {
  navn: 'Manuelle rullestoler',
  beskrivelse:
    'Hjelpemidler som gir mobilitet og sittende støtte for personer med begrenset bevegelighet, der brukeren selv eller en ledsager kjører rullestolen manuelt.',
  underkategorier: [],
  isoer: ['1222', '122704'],
  visProdukter: true,
}

export const ganghjelpemidler: Kategori = {
  navn: 'Ganghjelpemidler',
  beskrivelse: '',
  underkategorier: [
    'Krykker, stokker og staver',
    'Gåstativer',
    'Rullatorer',
    'Gåstoler',
    'Gåbord',
    'Tilleggsutstyr til ganghjelpemidler',
  ],
  isoer: [],
  visProdukter: false,
}
export const forflytning: Kategori = {
  navn: 'Forflytning',
  beskrivelse: '',
  underkategorier: ['Trappeklatrere', 'Hjelpemidler for å endre kroppsstilling', 'Personløftere'],
  isoer: [],
  visProdukter: false,
}
export const trappeklatrere: Kategori = {
  navn: 'Trappeklatrere',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121703'],
  visProdukter: true,
}

export const endreKroppsstilling: Kategori = {
  navn: 'Hjelpemidler for å endre kroppsstilling',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['1231'],
  visProdukter: true,
}

export const personløftere: Kategori = {
  navn: 'Personløftere',
  beskrivelse: '',
  isoer: [],
  underkategorier: ['Stasjonære personløftere', 'Mobile personløftere', 'Seil og seler'],
  visProdukter: false,
}

export const stasjonærePersonløftere: Kategori = {
  navn: 'Stasjonære personløftere',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['123612', '123615'],
  visProdukter: true,
}

export const mobilePersonløftere: Kategori = {
  navn: 'Mobile personløftere',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['123603', '123604', '123606'],
  visProdukter: true,
}
export const seilOgSeler: Kategori = {
  navn: 'Seil og seler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['123621'],
  visProdukter: true,
}

export const sykler: Kategori = {
  navn: 'Sykler',
  beskrivelse: '',
  underkategorier: [
    'Tandemsykler',
    'Tohjulssykler',
    'Tre- og firehjulssykler',
    'Hjulspark og sparkesykler',
    'Tilleggsutstyr til sykler',
  ],
  isoer: [],
  visProdukter: false,
}

export const tandemsykler: Kategori = {
  navn: 'Tandemsykler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121815'],
  visProdukter: true,
}
export const tohjulssykler: Kategori = {
  navn: 'Tohjulssykler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121804'],
  visProdukter: true,
}
export const treOgFirehjulssykler: Kategori = {
  navn: 'Tre- og firehjulssykler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121806', '121807', '120809'],
  visProdukter: true,
}
export const hjulsparkOgSparkesykler: Kategori = {
  navn: 'Hjulspark og sparkesykler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121812'],
  visProdukter: true,
}
export const tilleggsutstyrSykler: Kategori = {
  navn: 'Tilleggsutstyr til sykler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121821'],
  visProdukter: true,
}
export const kjelkerOgAkebrett: Kategori = {
  navn: 'Kjelker og akebrett',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['122710'],
  visProdukter: true,
}
export const vogner: Kategori = {
  navn: 'Vogner',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['122707', '122715'],
  visProdukter: true,
}
export const bilseterOgBilutstyr: Kategori = {
  navn: 'Bilseter og bilutstyr',
  beskrivelse: '',
  underkategorier: [
    'Bilseter og bilputer',
    'Lette inn- og utstigning av bil',
    'Belter og støtteseler for bil',
    'Ramper for bil',
  ],
  isoer: [],
  visProdukter: false,
}

export const bilseterOgBilputer: Kategori = {
  navn: 'Bilseter og bilputer',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121212'],
  visProdukter: true,
}

export const letteInnOgUtstigningBil: Kategori = {
  navn: 'Lette inn- og utstigning av bil',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121281'],
  visProdukter: true,
}

export const belterOgStøtteselerBil: Kategori = {
  navn: 'Belter og støtteseler for bil',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121209'],
  visProdukter: true,
}

export const ramperForBil: Kategori = {
  navn: 'Ramper for bil',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['121221'],
  visProdukter: true,
}

export const elektriskeRullestoler: Kategori = {
  navn: 'Elektriske rullestoler',
  beskrivelse:
    'Hjelpemidler som drives med motor, og som gir mulighet for mobilitet og sittende støtte for personer med redusert forflytningsevne. Motoren kan ha framdrift som er elektrisk eller forbrenningsbasert. ',
  underkategorier: [],
  isoer: ['1223'],
  visProdukter: true,
}

export const motoriserteKjøretøy: Kategori = {
  navn: 'Motoriserte kjøretøy',
  beskrivelse:
    'Diverse motoriserte kjøretøy med 4 hjul. Omfatter f.eks. terrenggående kjøretøy (ATV), firehjulinger og gokarter. ',
  underkategorier: [],
  isoer: ['121709'],
  visProdukter: true,
}

export const drivaggregat: Kategori = {
  navn: 'Drivaggregat',
  beskrivelse:
    'Hjelpemidler som monteres på en manuell rullestol, som gjør det mulig for brukeren eller ledsageren å manøvrere eller kjøre rullestolen uten bruk av muskelkraft.',
  underkategorier: [],
  isoer: ['122409'],
  visProdukter: true,
}
export const tilleggsutstyrRullestoler: Kategori = {
  navn: 'Tilleggsutstyr til rullestoler',
  beskrivelse: 'Utstyr relatert til bruk av rullestoler.',
  underkategorier: [],
  isoer: ['1224'],
  visProdukter: true,
}

export const krykkerOgStokkerOgStaver: Kategori = {
  navn: 'Krykker, stokker og staver',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['1203'],
  visProdukter: true,
}

export const gåstativer: Kategori = {
  navn: 'Gåstativer',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['120603'],
  visProdukter: true,
}

export const rullatorer: Kategori = {
  navn: 'Rullatorer',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['120606'],
  visProdukter: true,
}

export const gåstoler: Kategori = {
  navn: 'Gåstoler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['120606'],
  visProdukter: true,
}

export const gåbord: Kategori = {
  navn: 'Gåbord',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['120612'],
  visProdukter: true,
}

export const tilleggsutstyrTilGanghjelpemidler: Kategori = {
  navn: 'Tilleggsutstyr til ganghjelpemidler',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['1207'],
  visProdukter: true,
}
