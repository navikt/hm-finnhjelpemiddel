import { Kategori } from '@/app/kategori/utils/mappings/kategori-mapping'
import { BicycleIcon, CarIcon, StrollerIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { GanghjelpemiddelIkon } from '@/app/kategori/ikoner/GanghjelpemiddelIkon'
import { ForflytningIkon } from '@/app/kategori/ikoner/ForflytningIkon'
import { KjelkerOgAkebrettIkon } from '@/app/kategori/ikoner/KjelkerOgAkebrettIkon'

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
  | 'Sittesystem'
  | 'Motoriserte kjøretøy'
  | 'Drivaggregat'
  | 'Utstyr til rullestoler'
  | 'Trappeklatrere'
  | 'Hjelpemidler for å endre kroppsstilling'
  | 'Personløftere'
  | 'Stasjonære personløftere'
  | 'Mobile personløftere'
  | 'Seil og seler'
  | 'Ramper, heiser og løfteplattformer'
  | 'Ramper'
  | 'Heiser'
  | 'Løfteplattformer'
  | 'Tandemsykler'
  | 'Tohjulssykler'
  | 'Trehjulssykler'
  | 'Hjulspark og sparkesykler'
  | 'Tilleggsutstyr til sykler'
  | 'Bilseter'
  | 'Belter og støtteseler for bil'
  | 'Ramper for bil'
  | 'Krykker og stokker'
  | 'Gåstativer'
  | 'Rullatorer'
  | 'Gåstoler'
  | 'Gåbord'
  | 'Tilleggsutstyr til ganghjelpemidler'
  | 'Kjøreposer og regntøy'
  | 'Posisjonering'

export const bevegelse: Kategori = {
  navn: 'Bevegelse',
  beskrivelse:
    'Hjelpemidler for å støtte eller erstatte en persons evne til å bevege seg innendørs og utendørs. Hjelpemidlene kan være til hjelp i aktiviteter som å sitte, ligge, snu seg, forflytte seg, reise seg, stå, gå, gripe og løfte.',
  underkategorier: [
    'Ganghjelpemidler',
    'Rullestoler',
    'Forflytning',
    'Sykler',
    'Kjelker og akebrett',
    'Vogner',
    'Bilseter og bilutstyr',
    'Kjøreposer og regntøy',
    'Posisjonering',
  ],
  isoer: [],
  visProdukter: false,
}

export const rullestoler: Kategori = {
  navn: 'Rullestoler',
  beskrivelse:
    'Hjelpemidler som gir mobilitet og sittende støtte for personer som har vansker med å gå eller stå over lengre tid. Rullestolene kjøres enten manuelt ved arm- eller beinkraft eller ved hjelp av en elektrisk motor. Kan også styres og driftes av ledsager.',
  underkategorier: [
    'Manuelle rullestoler',
    'Elektriske rullestoler',
    'Sittesystem',
    'Motoriserte kjøretøy',
    'Drivaggregat',
    'Utstyr til rullestoler',
  ],
  isoer: [],
  visProdukter: false,
  ikon: <WheelchairIcon aria-hidden fontSize={'32px'} />,
}

export const manuelleRullestoler: Kategori = {
  navn: 'Manuelle rullestoler',
  beskrivelse:
    'Rullestoler der personen selv eller en ledsager kjører rullestolen manuelt. Omfatter også rullestoler med ståfunksjon og rullestoler til bruk på stranden eller i basseng.',
  underkategorier: [],
  isoer: ['1222', '122704'],
  visProdukter: true,
}

export const ganghjelpemidler: Kategori = {
  navn: 'Ganghjelpemidler',
  beskrivelse: 'Hjelpemidler som støtter personen under gange. Hjelpemiddelet håndteres med én eller to armer.  ',
  underkategorier: [
    'Krykker og stokker',
    'Gåstativer',
    'Rullatorer',
    'Gåstoler',
    'Gåbord',
    'Tilleggsutstyr til ganghjelpemidler',
  ],
  isoer: [],
  visProdukter: false,
  ikon: <GanghjelpemiddelIkon aria-hidden />,
}
export const forflytning: Kategori = {
  navn: 'Forflytning',
  beskrivelse:
    'Hjelpemidler som hjelper personer med nedsatt funksjonsevne med å flytte seg fra ett sted til et annet, enten selvstendig eller med hjelpere. Eksempel på forflytningshjelpemidler er personløftere, overflyttingsplattformer, glidelaken med mer.',
  underkategorier: [
    'Trappeklatrere',
    'Hjelpemidler for å endre kroppsstilling',
    'Personløftere',
    'Ramper, heiser og løfteplattformer',
  ],
  isoer: [],
  visProdukter: false,
  ikon: <ForflytningIkon aria-hidden />,
}
export const trappeklatrere: Kategori = {
  navn: 'Trappeklatrere',
  beskrivelse:
    'Trappeklatrere er beregnet for å transportere personer opp eller ned trapper. Trappeklatreren er ikke festet eller koblet til trappetrinnene, veggene eller taket i tilknytning til en trapp. Betjenes av ledsager.',
  underkategorier: [],
  isoer: ['121703'],
  visProdukter: true,
}

export const endreKroppsstilling: Kategori = {
  navn: 'Hjelpemidler for å endre kroppsstilling',
  beskrivelse:
    'Dette er hjelpemidler som endrer en persons stilling eller plassering, hjelpemidler for å løfte en person opp fra gulvet, hjelpemidler som brukes for å forflytte en person fra ett sted til et annet båret av én eller flere ledsagere og hjelpemidler som hjelper en person å forflytte en annen person manuelt. Eksempler på slike hjelpemidler er sklimatter, glidebrett, overflyttingsplattformer, oppreisingsbelter og bærestoler.',
  underkategorier: [],
  isoer: ['1231'],
  visProdukter: true,
}

export const personløftere: Kategori = {
  navn: 'Personløftere',
  beskrivelse:
    'Hjelpemidler for forflytning av en person ved hjelp av løfting og posisjonering for å muliggjøre en planlagt aktivitet.',
  isoer: [],
  underkategorier: ['Stasjonære personløftere', 'Mobile personløftere', 'Seil og seler'],
  visProdukter: false,
}

export const stasjonærePersonløftere: Kategori = {
  navn: 'Stasjonære personløftere',
  beskrivelse:
    'Personløftere, oftest montert i tak, for å forflytte en person innen et område som begrenses av løftesystemet. Omfatter også badekarheiser.',
  underkategorier: [],
  isoer: ['123612', '123615'],
  visProdukter: true,
}

export const mobilePersonløftere: Kategori = {
  navn: 'Mobile personløftere',
  beskrivelse:
    'Noen personløftere er for forflytning av en person i sittende, halvt sittende eller liggende stilling. Andre personløftere hjelper til med å forflytte en person fra sittende til stående stilling. Kroppen støttes av seler, seil eller knestøtte. Personløftene er mobile og kan flyttes fritt omkring.',
  underkategorier: [],
  isoer: ['123603', '123604', '123606'],
  visProdukter: true,
}
export const seilOgSeler: Kategori = {
  navn: 'Seil og seler',
  beskrivelse:
    'Hjelpemidler som gir støtte til en person som forflyttes i en mobil eller stasjonær personløfter. Omfatter for eksempel seil, seler, vester og bukser.',
  underkategorier: [],
  isoer: ['123621'],
  visProdukter: true,
}

export const ramperOgHeiserOgLøfteplattformer: Kategori = {
  navn: 'Ramper, heiser og løfteplattformer',
  beskrivelse:
    'Bærbare og fastmonterte ramper for trinnløs forflytning. Heiser og løfteplattformer forflytter en person fra ulike nivå.',
  underkategorier: ['Ramper', 'Heiser', 'Løfteplattformer'],
  isoer: [],
  visProdukter: false,
}

export const ramper: Kategori = {
  navn: 'Ramper',
  beskrivelse: 'Fastmonterte og bærbare ramper for trinnløs forflytning mellom ulike nivåer.',
  underkategorier: [],
  isoer: ['183015', '183018'],
  visProdukter: true,
}

export const heiser: Kategori = {
  navn: 'Heiser',
  beskrivelse:
    'Trappeheiser med sete eller plattform. Omfatter også løfteutstyr som heves og senkes inne i en sjakt. Forflytter en person mellom to eller flere nivå.',
  underkategorier: [],
  isoer: ['183003', '183010', '183011'],
  visProdukter: true,
}

export const løfteplattformer: Kategori = {
  navn: 'Løfteplattformer',
  beskrivelse: 'Løfteutstyr med plattform for å forflytte en person mellom to eller flere nivå.',
  underkategorier: [],
  isoer: ['183005'],
  visProdukter: true,
}

export const sykler: Kategori = {
  navn: 'Sykler',
  beskrivelse:
    'Aktivitets- eller forflytningshjelpemiddel som finnes i mange varianter. Syklene har to eller tre hjul, kan styres med armer eller bein og har manuell eller elektrisk fremdrift.',
  underkategorier: [
    'Tandemsykler',
    'Tohjulssykler',
    'Trehjulssykler',
    'Hjulspark og sparkesykler',
    'Tilleggsutstyr til sykler',
  ],
  isoer: [],
  visProdukter: false,
  ikon: <BicycleIcon aria-hidden fontSize={'32px'} />,
}

export const tandemsykler: Kategori = {
  navn: 'Tandemsykler',
  beskrivelse:
    'pedaldrevne sykler med to eller flere seter som gjør det mulig for flere personer å sykle på samme sykkel. Finnes med og uten hjelpemotor.',
  underkategorier: [],
  isoer: ['121815'],
  visProdukter: true,
}
export const tohjulssykler: Kategori = {
  navn: 'Tohjulssykler',
  beskrivelse: 'Fotdrevne tohjulssykler beregnet for én person. Finnes med og uten hjelpemotor.',
  underkategorier: [],
  isoer: ['121804'],
  visProdukter: true,
}
export const trehjulssykler: Kategori = {
  navn: 'Trehjulssykler',
  beskrivelse: 'Fot- eller hånddrevne sykler med tre hjul beregnet på én person.',
  underkategorier: [],
  isoer: ['121806', '121807', '120809'],
  visProdukter: true,
}
export const hjulsparkOgSparkesykler: Kategori = {
  navn: 'Hjulspark og sparkesykler',
  beskrivelse: 'Hjelpemidler med hjul, fotplate(r) og styre som drives ved å sparke seg fram.',
  underkategorier: [],
  isoer: ['121812'],
  visProdukter: true,
}
export const tilleggsutstyrSykler: Kategori = {
  navn: 'Tilleggsutstyr til sykler',
  beskrivelse: 'Tilleggsutstyr for sykler. Omfatter for eksempel ekstra motorer og støttehjul.',
  underkategorier: [],
  isoer: ['121821'],
  visProdukter: true,
}
export const kjelkerOgAkebrett: Kategori = {
  navn: 'Kjelker og akebrett',
  beskrivelse: 'Hjelpemidler for å transportere en person over is og snø, påmontert meier med eller uten hjul.',
  underkategorier: [],
  isoer: ['122710'],
  visProdukter: true,
  ikon: <KjelkerOgAkebrettIkon aria-hidden />,
}
export const vogner: Kategori = {
  navn: 'Vogner',
  beskrivelse:
    'Hjelpemidler med hjul som har plass til én eller flere personer i liggende eller sittende stilling, og som er utformet for å drives og styres av en ledsager. Omfatter f.eks. sittevogner og liggevogner for både barn og voksne.',
  underkategorier: [],
  isoer: ['122707', '122715'],
  visProdukter: true,
  ikon: <StrollerIcon aria-hidden fontSize={'32px'} />,
}
export const bilseterOgBilutstyr: Kategori = {
  navn: 'Bilseter og bilutstyr',
  beskrivelse:
    'Hjelpemidler som kan monteres i bil, eller tilpasninger av bil som enten gjør det mulig for en person med funksjonsnedsettelser å kjøre bilen, eller som letter inn- og utstigningen eller opphold i bil. Omfatter bilseter, dreieseter, løfteseter og glideseter.',
  underkategorier: ['Bilseter', 'Belter og støtteseler for bil', 'Ramper for bil'],
  isoer: [],
  visProdukter: false,
  ikon: <CarIcon aria-hidden fontSize={'32px'} />,
}

export const bilseter: Kategori = {
  navn: 'Bilseter',
  beskrivelse: 'Bilseter for barn og voksne for å gi ekstra støtte under transport.',
  underkategorier: [],
  isoer: ['121212'],
  visProdukter: true,
}

export const belterOgStøtteselerBil: Kategori = {
  navn: 'Belter og støtteseler for bil',
  beskrivelse:
    'Hjelpemidler som fester en person i bilen og som gir sikkerhet under transport. Omfatter for eksempel 3- og 4-punkts setebelter og beltevester for passasjerer som sitter i rullestol under transport.',
  underkategorier: [],
  isoer: ['121209'],
  visProdukter: true,
}

export const ramperForBil: Kategori = {
  navn: 'Ramper for bil',
  beskrivelse: 'Hjelpemidler for å kunne kjøre rullestol inn og ut av bil. ',
  underkategorier: [],
  isoer: ['121221'],
  visProdukter: true,
}

export const elektriskeRullestoler: Kategori = {
  navn: 'Elektriske rullestoler',
  beskrivelse:
    'Rullestoler som drives med elektrisk motor, beregnet for inne eller utebruk. Omfatter også elektriske rullestoler med ståfunksjon.',
  underkategorier: [],
  isoer: ['1223'],
  visProdukter: true,
}

export const sittesystem: Kategori = {
  navn: 'Sittesystem',
  beskrivelse:
    'Sittemoduler består av et sete som kan passe til ett eller flere et understell til ulik bruk. Noen sittemoduler kan være støpt etter kroppsform.',
  underkategorier: [],
  isoer: ['180939'],
  visProdukter: true,
}

export const motoriserteKjøretøy: Kategori = {
  navn: 'Motoriserte kjøretøy',
  beskrivelse: 'Motoriserte kjøretøy til bruk ute i terrenget. Har ofte fire hjul eller er beltedrevet.',
  underkategorier: [],
  isoer: ['121709'],
  visProdukter: true,
}

export const drivaggregat: Kategori = {
  navn: 'Drivaggregat',
  beskrivelse:
    'Hjelpemidler som monteres på en manuell rullestol, som gjør det mulig for personen å kjøre rullestolen med liten eller ingen bruk av muskelkraft. Kan også av ledsagerstyres.',
  underkategorier: [],
  isoer: ['122409'],
  visProdukter: true,
}
export const utstyrTilRullestoler: Kategori = {
  navn: 'Utstyr til rullestoler',
  beskrivelse: 'Utstyr relatert til rullestoler, for eksempel batterier, bremser, dekk, rullestolgarasjer og hjulski.',
  underkategorier: [],
  isoer: ['1224', '090205', '090312'],
  visProdukter: true,
}

export const krykkerOgStokker: Kategori = {
  navn: 'Krykker og stokker',
  beskrivelse: 'Hjelpemidler som gir støtte og balanse under gange, som brukes enkeltvis eller i par. ',
  underkategorier: [],
  isoer: ['1203'],
  visProdukter: true,
}

export const gåstativer: Kategori = {
  navn: 'Gåstativer',
  beskrivelse:
    'Stativ som løftes ved gange som gir stabilitet og balanse. Man støttes av egen kroppsvekt under gange eller i stående stilling.',
  underkategorier: [],
  isoer: ['120603'],
  visProdukter: true,
}

export const rullatorer: Kategori = {
  navn: 'Rullatorer',
  beskrivelse: 'Hjelpemidler som man skyver foran eller dra etter seg som gir stabilitet og balanse under gange.',
  underkategorier: [],
  isoer: ['120606'],
  visProdukter: true,
}

export const gåstoler: Kategori = {
  navn: 'Gåstoler',
  beskrivelse:
    'Hjelpemidler med hjul og sete eller sele som støtter kroppen under gange. Finnes med eller uten underarmsstøtte.',
  underkategorier: [],
  isoer: ['120609'],
  visProdukter: true,
}

export const gåbord: Kategori = {
  navn: 'Gåbord',
  beskrivelse:
    'Hjelpemidler med hjul der man har mulighet til å støtte overkroppen under gange. Skyves forover med begge armene eventuelt i kombinasjon med overkroppen.',
  underkategorier: [],
  isoer: ['120612'],
  visProdukter: true,
}

export const tilleggsutstyrTilGanghjelpemidler: Kategori = {
  navn: 'Tilleggsutstyr til ganghjelpemidler',
  beskrivelse:
    'Hjelpemidler som brukes sammen med, eller for å oppbevare ganghjelpemidler, som for eksempel krykkeholdere og krykkebelter.',
  underkategorier: [],
  isoer: ['1207'],
  visProdukter: true,
}

export const kjøreposerOgRegntøy: Kategori = {
  navn: 'Kjøreposer og regntøy',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['090305'],
  visProdukter: true,
}

export const posisjonering: Kategori = {
  navn: 'Posisjonering',
  beskrivelse: '',
  underkategorier: [],
  isoer: ['0907'],
  visProdukter: true,
}
