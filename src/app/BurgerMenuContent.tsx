import { AgreementLabel, agreementHasNoProducts } from '@/utils/agreement-util'
import { logNavigationEvent } from '@/utils/amplitude'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { HStack, Heading, Link } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import AutocompleteSearch from '../components/filters/AutocompleteSearch'

interface Props {
  searchOpen: boolean
  menuOpen: boolean

  setMenuOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

const BurgerMenuContent = ({ searchOpen, menuOpen, setMenuOpen, setSearchOpen }: Props) => {
  const { data: agreements } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const router = useRouter()

  const onSearch = useCallback(
    (searchTerm: string) => {
      setSearchOpen(false)
      router.push('/sok?term=' + searchTerm)
    },
    [router, setSearchOpen]
  )

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
          <div className="burgermenu-container__content spacing-vertical--medium  main-wrapper--xlarge">
            <>
              <HStack>
                <div>
                  <Heading level="2" size="small">
                    Avtale med NAV
                  </Heading>
                  <ul>
                    <li>
                      <Link
                        className="burgermenu-container__link"
                        as={NextLink}
                        href="/rammeavtale"
                        onClick={() => {
                          setMenuOpen(false)
                          logNavigationEvent('meny', 'rammeavtale', 'Avtaler med NAV')
                        }}
                      >
                        <ChevronRightIcon aria-hidden title="Pil mot høyre" fontSize="1.5rem" />
                        Avtaler med NAV
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="burgermenu-container__link"
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
                        <ChevronRightIcon aria-hidden title="Pil mot høyre" fontSize="1.5rem" />
                        Slik kan du se at et hjelpemiddel er på avtale med NAV
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <Heading level="2" size="small" style={{ marginTop: '4px' }}>
                    Leverandører
                  </Heading>
                  <ul>
                    <li>
                      <Link
                        className="burgermenu-container__link"
                        as={NextLink}
                        href="/leverandorer"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ChevronRightIcon aria-hidden title="Pil mot høyre" fontSize="1.5rem" />
                        Leverandøroversikt
                      </Link>
                    </li>
                  </ul>
                </div>
              </HStack>
              <Heading level="2" size="small" style={{ marginTop: '4px' }}>
                Hjelpemidler på avtale med NAV
              </Heading>
              <ul>
                {sortedAgreements.map((agreement) => (
                  <li key={agreement.id}>
                    <Link
                      className="burgermenu-container__link"
                      as={NextLink}
                      href={`/rammeavtale/hjelpemidler/${agreement.id}`}
                      onClick={() => {
                        setMenuOpen(false)
                        logNavigationEvent('meny', 'hurtigoversikt', agreement.label)
                      }}
                    >
                      <ChevronRightIcon aria-hidden title="Pil mote høyre" fontSize="1.5rem" />
                      {agreement.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
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

export default BurgerMenuContent
