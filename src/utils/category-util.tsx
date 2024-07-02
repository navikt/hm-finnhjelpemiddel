import {
  BriefcaseIcon,
  Buildings2Icon,
  EarIcon,
  EyeIcon,
  HandBandageIcon,
  HandShakeHeartIcon,
  HeadHeartIcon,
  HeartIcon,
  HouseHeartIcon,
  KeyHorizontalIcon,
  PersonChatIcon,
  TeddyBearIcon,
  WeightIcon,
  WheelchairIcon,
} from '@navikt/aksel-icons'

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
    icon: <HandBandageIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Funksjonsstøtte',
  },
  {
    name: 'Trening og aktivitet',
    icon: <WeightIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Trening%20og%20aktivitet',
  },
  {
    name: 'Egenomsorg og pleie',
    icon: <HeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Egenomsorg%20og%20pleie',
  },
  {
    name: 'Mobilitet',
    icon: <WheelchairIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Mobilitet',
  },
  {
    name: 'Husarbeid og deltakelse',
    icon: <HouseHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Husarbeid%20og%20deltakelse',
  },
  {
    name: 'Miljøtilrettelegging',
    icon: <Buildings2Icon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Miljøtilrettelegging',
  },
  {
    name: 'Barn og unge',
    icon: <TeddyBearIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Barn%20og%20unge',
  },
  {
    name: 'Kommunikasjonsverktøy',
    icon: <PersonChatIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: '/sok?categories=Kommunikasjonsverktøy',
  },
  {
    name: 'Håndteringsverktøy',
    icon: <HandShakeHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Håndteringsverktøy',
  },
  {
    name: 'Omgivelseskontroll',
    icon: <KeyHorizontalIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Omgivelseskontroll',
  },
  {
    name: 'Deltakelse i arbeidslivet',
    icon: <BriefcaseIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Deltakelse%20i%20arbeidslivet',
  },
  {
    name: 'Synsnedsettelse',
    icon: <EyeIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Synsnedsettelse',
  },
  {
    name: 'Hørselsnedsettelse',
    icon: <EarIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Hørselsnedsettelse',
  },
  {
    name: 'Psykososial funksjonsstøtte',
    icon: <HeadHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,

    link: '/sok?categories=Psykososial%20funksjonsstøtte',
  },
]
