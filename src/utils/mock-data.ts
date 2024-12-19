import { Product } from './product-util'

export const agreements = [
  {
    id: '9e81826e-9ec0-4333-94e5-8f079b5e53b0',
    identifier: 'HMDB-8709',
    title: 'Sitteputer med trykksårforebyggende egenskaper',
    label: 'Sitteputer - trykksårforebyggende',
    rank: 2,
    postNr: 5,
    postIdentifier: 'HMDB-1244',
    postTitle: 'Post 5: Sittepute som skal innstilles - høy modell ',
    reference: '21-16697',
    expired: '2025-02-01T00:00:00',
  },
  {
    id: '9e81826e-9ec0-4333-94e5-8f079b5e53b0',
    identifier: 'HMDB-8709',
    title: 'Sitteputer med trykksårforebyggende egenskaper',
    label: 'Sitteputer - trykksårforebyggende',
    rank: 1,
    postNr: 7,
    postIdentifier: 'HMDB-1246',
    postTitle: 'Post 7: Sittepute for posisjonering uten bruk av pumpe',
    reference: '21-16697',
    expired: '2025-02-01T00:00:00',
  },
]

export const accessoriesMock: Product[] = [
  {
    id: 'HMDB-60027',
    title: 'Vicair AdjusterO2 10',
    attributes: {
      compatibleWith: ['HMDB-64818', 'HMDB-54382', 'HMDB-50757'],
      series: 'Univox CLS-5',
      shortdescription:
        'Digital lydinngang. Automatic gain control. Justerbar tidsforsinkelse for tilkoblet lyd. Dekningsgrad i et tilnærmet kvadratisk rom er 140 kvm. ',
      text: 'Teleslyngeforsterker egnet til bruk i private hjem, spesielt tilpasset TV og radio, slik at man trådløst kan høre via telespolen i høreapparatet. Har analoge og digitale tilkoblinger og TV-sync for lyd uten ekko.   ',
    },
    agreements: agreements,
    variantCount: 1,
    variants: [
      {
        id: '64e4f716-08bb-4b48-8a52-695511496183',
        hmsArtNr: '202258',
        supplierRef: '1104113',
        articleName: 'Univox CLS-5',
        techData: {},
        hasAgreement: true,
        filters: {},
        expired: '2043-08-07T14:33:40.468028091',
        agreements: agreements,
        status: 'ACTIVE',
        bestillingsordning: false,
        digitalSoknad: false,
      },
    ],
    compareData: { techDataRange: {}, agreementRank: null },
    isoCategory: '22183001',
    isoCategoryTitle: 'Teleslyngeforsterkere',
    isoCategoryText:
      'Hjelpemidler for å ta imot eller sende informasjon med elektromagnetiske bølger i teleslyngesystemer. Hørselshjelpemidler, se 22 06.',
    isoCategoryTitleInternational: 'Induction loop amplifiers',
    accessory: false,
    sparepart: false,
    photos: [{ uri: 'orig/52674.jpg' }],
    videos: [
      {
        uri: 'https://www.youtube.com/watch?v=nmstO_nDB80',
        text: 'Video 1',
      },
      {
        uri: 'https://www.youtube.com/watch?v=GZMpDioE2sY',
        text: '',
      },
    ],
    documents: [],
    supplierId: 'e9e27708-16be-4995-83a7-f857b77d0913',
    supplierName: 'Levereandør AS',
  },
]
