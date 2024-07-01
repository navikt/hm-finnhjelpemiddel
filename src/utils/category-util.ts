export const getIsoCategoryBasedOnProductCategory = (value: string) => {
  switch (value) {
    case 'Funksjonsstøtte':
      return '04'
    case 'Trening og aktivitet':
      return '05'
    case 'Egenomsorg og pleie':
      return '09'
    case 'Mobilitet':
      return '12'
    case 'Husarbeid og deltakelse':
      return '15'
    case 'Miljøtilrettelegging':
      return '18'
    case 'Kommunikasjonsverktøy':
      return '22'
    case 'Håndteringsverktøy':
      return '24'
    case 'Omgivelseskontroll':
      return '27'
    case 'Deltakelse i arbeidslivet':
      return '28'
    case 'Psykososial funksjonsstøtte':
      return '30'
    default:
      return ''
  }
}

export const categories = [
  {
    name: 'Funksjonsstøtte',
    link: 'www.vg.no',
    filter: { isoCategory: '04' },
  },
  {
    name: 'Trening og aktivitet',
    link: 'www.vg.no',
    filter: { isoCategory: '05' },
  },
  {
    name: 'Egenomsorg og pleie',
    link: 'www.vg.no',
    filter: { isoCategory: '09' },
  },
  {
    name: 'Mobilitet',
    link: 'www.vg.no',
    filter: { isoCategory: '12' },
  },
  {
    name: 'Husarbeid og deltakelse',
    link: 'www.vg.no',
    filter: { isoCategory: '15' },
  },
  {
    name: 'Miljøtilrettelegging',
    link: 'www.vg.no',
    filter: { isoCategory: '18' },
  },
  {
    name: 'Barn og unge',
    link: 'www.vg.no',
    filter: {},
  },
  {
    name: 'Kommunikasjonsverktøy',
    link: 'www.vg.no',
    filter: { isoCategory: '22' },
  },
  {
    name: 'Håndteringsverktøy',
    link: 'www.vg.no',
    filter: { isoCategory: '24' },
  },
  {
    name: 'Omgivelseskontroll',
    link: 'www.vg.no',
    filter: { isoCategory: '27' },
  },
  {
    name: 'Deltakelse i arbeidslivet',
    link: 'www.vg.no',
    filter: { isoCategory: '28' },
  },
  {
    name: 'Synsnedsettelse',
    link: 'www.vg.no',
    filter: {},
  },
  {
    name: 'Hørselsnedsettelse',
    link: 'www.vg.no',
    filter: {},
  },
  {
    name: 'Psykososial funksjonsstøtte',
    link: 'www.vg.no',
    filter: { isoCategory: '30' },
  },
]
