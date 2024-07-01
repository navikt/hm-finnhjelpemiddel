import { logNavigationEvent } from '@/utils/amplitude'
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
import { HGrid, Heading, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'

interface Props {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

const BurgerMenuContent = ({ menuOpen, setMenuOpen }: Props) => {
  return (
    <>
      {menuOpen && (
        <div className="burgermenu-container">
          <div className="burgermenu-container__content main-wrapper--large">
            <HGrid columns={{ xs: 1, md: '4fr 3fr' }} gap={{ xs: '8', md: '16' }}>
              <div>
                <Heading level="2" size="small">
                  KATEGORIER
                </Heading>

                <ul className="burgermenu-container__category-list">
                  {kategorier.map((kategori) => (
                    <li key={kategori.name}>
                      <HGrid gap="6" columns={'50px auto'}>
                        <div className="burgermenu-container__category-icon">{kategori.icon}</div>
                        <Link
                          as={NextLink}
                          href={kategori.link}
                          onClick={() => {
                            setMenuOpen(false)
                          }}
                        >
                          {kategori.name}
                        </Link>
                      </HGrid>
                    </li>
                  ))}
                </ul>
              </div>

              <VStack gap={{ xs: '1', md: '5' }}>
                <Heading level="2" size="small">
                  SNARVEIER
                </Heading>
                <VStack as={'ul'} gap={{ xs: '4', md: '6' }}>
                  <li>
                    <Link
                      as={NextLink}
                      href="/rammeavtale"
                      onClick={() => {
                        setMenuOpen(false)
                        logNavigationEvent('meny', 'rammeavtale', 'Avtaler med NAV')
                      }}
                    >
                      Avtaler med NAV
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href="/rammeavtale#se-at-et-hjelpemiddel-er-på-avtale"
                      onClick={() => {
                        setMenuOpen(false)
                        logNavigationEvent(
                          'meny',
                          'rammeavtale',
                          'Slik kan du se at et hjelpemiddel er på avtale med NAV'
                        )
                      }}
                    >
                      Slik kan du se at et hjelpemiddel er på avtale med NAV
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href="/leverandorer"
                      onClick={() => {
                        setMenuOpen(false)
                        logNavigationEvent('meny', 'leverandorer', 'Leverandøroversikt')
                      }}
                    >
                      Leverandøroversikt
                    </Link>
                  </li>
                </VStack>
              </VStack>
            </HGrid>
          </div>
        </div>
      )}
    </>
  )
}

const kategorier = [
  {
    name: 'Funksjonsstøtte',
    icon: <HandBandageIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '04' },
  },
  {
    name: 'Trening og aktivitet',
    icon: <WeightIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '05' },
  },
  {
    name: 'Egenomsorg og pleie',
    icon: <HeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '09' },
  },
  {
    name: 'Mobilitet',
    icon: <WheelchairIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '12' },
  },
  {
    name: 'Husarbeid og deltakelse',
    icon: <HouseHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '15' },
  },
  {
    name: 'Miljøtilrettelegging',
    icon: <Buildings2Icon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '18' },
  },
  {
    name: 'Barn og unge',
    icon: <TeddyBearIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: {},
  },
  {
    name: 'Kommunikasjonsverktøy',
    icon: <PersonChatIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '22' },
  },
  {
    name: 'Håndteringsverktøy',
    icon: <HandShakeHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '24' },
  },
  {
    name: 'Omgivelseskontroll',
    icon: <KeyHorizontalIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '27' },
  },
  {
    name: 'Deltakelse i arbeidslivet',
    icon: <BriefcaseIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '28' },
  },
  {
    name: 'Synsnedsettelse',
    icon: <EyeIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: {},
  },
  {
    name: 'Hørselsnedsettelse',
    icon: <EarIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: {},
  },
  {
    name: 'Psykososial funksjonsstøtte',
    icon: <HeadHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
    filter: { isoCategory: '30' },
  },
]

export default BurgerMenuContent
