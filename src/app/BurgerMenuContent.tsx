import { AgreementLabel, agreementHasNoProducts } from '@/utils/agreement-util'
import { logNavigationEvent } from '@/utils/amplitude'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
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
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import useSWR from 'swr'
import AutocompleteSearch from './AutocompleteSearch'

interface Props {
  searchOpen: boolean
  menuOpen: boolean

  setMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  onSearch: (searchTerm: string) => void
}

const BurgerMenuContent = ({ searchOpen, menuOpen, setMenuOpen, setSearchOpen, onSearch }: Props) => {
  const { data: agreements } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const router = useRouter()

  const sortedAgreements = useMemo(() => {
    if (!agreements) return []
    const filteredData = agreements.filter((agreement) => !agreementHasNoProducts(agreement.identifier))
    // Create a copy of data to avoid modifying it in place
    filteredData.sort((a, b) => sortAlphabetically(a.label, b.label))

    return filteredData
  }, [agreements])

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
              <VStack gap={{ xs: '8', md: '16' }}>
                <AutocompleteSearch onSearch={onSearch} />

                <VStack gap={{ xs: '1', md: '4' }}>
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
              </VStack>
            </HGrid>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="burgermenu-container">
          <div className="burgermenu-container__content">
            <AutocompleteSearch onSearch={onSearch} />
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
  },
  {
    name: 'Trening og aktivitet',
    icon: <WeightIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  {
    name: 'Egenomsorg og pleie',
    icon: <HeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  { name: 'Mobilitet', icon: <WheelchairIcon aria-hidden fontSize={'24px'} color="#0067C5" />, link: 'www.vg.no' },
  {
    name: 'Husarbeid og deltakelse',
    icon: <HouseHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  {
    name: 'Miljøtilrettelegging',
    icon: <Buildings2Icon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  { name: 'Barn og unge', icon: <TeddyBearIcon aria-hidden fontSize={'24px'} color="#0067C5" />, link: 'www.vg.no' },
  {
    name: 'Kommunikasjonsverktøy',
    icon: <PersonChatIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  {
    name: 'Håndteringsverktøy',
    icon: <HandShakeHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  {
    name: 'Omgivelseskontroll',
    icon: <KeyHorizontalIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  {
    name: 'Deltakelse i arbeidslivet',
    icon: <BriefcaseIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
  { name: 'Synsnedsettelse', icon: <EyeIcon aria-hidden fontSize={'24px'} color="#0067C5" />, link: 'www.vg.no' },
  { name: 'Hørselsnedsettelse', icon: <EarIcon aria-hidden fontSize={'24px'} color="#0067C5" />, link: 'www.vg.no' },
  {
    name: 'Psykososial funksjonsstøtte',
    icon: <HeadHeartIcon aria-hidden fontSize={'24px'} color="#0067C5" />,
    link: 'www.vg.no',
  },
]

export default BurgerMenuContent
