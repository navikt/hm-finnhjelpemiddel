export const getIsoCategoryBasedOnProductCategory = (value: string): string[] => {
  switch (value) {
    case 'Funksjonsstøtte':
      return ['04']
    case 'Trening og aktivitet':
      return ['05']
    case 'Egenomsorg og pleie':
      return ['0912', '0933', '0936', '0939', '0942', '0945']
    case 'Mobilitet':
      return ['12']
    case 'Husarbeid og deltakelse':
      return ['15']
    case 'Miljøtilrettelegging':
      return ['18']
    case 'Kommunikasjonsverktøy':
      return ['22']
    case 'Håndteringsverktøy':
      return ['24']
    case 'Omgivelseskontroll':
      return ['27']
    case 'Deltakelse i arbeidslivet':
      return ['28']
    case 'Synsnedsettelse':
      return ['2203']
    case 'Hørselsnedsettelse':
      return ['221824', '221827', '221830', '221833', '221836']
    case 'Psykososial funksjonsstøtte':
      return ['30']
    default:
      return []
  }
}

export const categories = [
  {
    name: 'Funksjonsstøtte',
    link: 'www.vg.no',
  },
  {
    name: 'Trening og aktivitet',
    link: 'www.vg.no',
  },
  {
    name: 'Egenomsorg og pleie',
    link: 'www.vg.no',
  },
  {
    name: 'Mobilitet',
    link: 'www.vg.no',
  },
  {
    name: 'Husarbeid og deltakelse',
    link: 'www.vg.no',
  },
  {
    name: 'Miljøtilrettelegging',
    link: 'www.vg.no',
  },
  {
    name: 'Barn og unge',
    link: 'www.vg.no',
  },
  {
    name: 'Kommunikasjonsverktøy',
    link: 'www.vg.no',
  },
  {
    name: 'Håndteringsverktøy',
    link: 'www.vg.no',
  },
  {
    name: 'Omgivelseskontroll',
    link: 'www.vg.no',
  },
  {
    name: 'Deltakelse i arbeidslivet',
    link: 'www.vg.no',
  },
  {
    name: 'Synsnedsettelse',
    link: 'www.vg.no',
  },
  {
    name: 'Hørselsnedsettelse',
    link: 'www.vg.no',
  },
  {
    name: 'Psykososial funksjonsstøtte',
    link: 'www.vg.no',
  },
]
