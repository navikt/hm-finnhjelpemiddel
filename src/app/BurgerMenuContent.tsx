import { AgreementLabel, agreementHasNoProducts } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { Heading, Link } from '@navikt/ds-react'
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
              <Heading level="2" size="small">
                Avtale med NAV
              </Heading>
              <ul>
                <li>
                  <Link
                    className="burgermenu-container__link"
                    as={NextLink}
                    href="/rammeavtale"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ChevronRightIcon title="Pil mot høyre" fontSize="1.5rem" />
                    Om avtaler med NAV
                  </Link>
                </li>
                <li>
                  <Link
                    className="burgermenu-container__link"
                    as={NextLink}
                    href="/rammeavtale#alle-avtaler"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ChevronRightIcon title="Pil mot høyre" fontSize="1.5rem" />
                    Alle avtaler med avtaleperiode
                  </Link>
                </li>
                <li>
                  <Link
                    className="burgermenu-container__link"
                    as={NextLink}
                    href="/rammeavtale#se-at-et-hjelpemiddel-er-på-avtale"
                    onClick={() => setMenuOpen(false)}
                  >
                    <ChevronRightIcon title="Pil mot høyre" fontSize="1.5rem" />
                    Slik kan du se at et hjelpemiddel er på avtale med NAV
                  </Link>
                </li>
              </ul>
              <Heading level="2" size="small" style={{ marginTop: '4px' }}>
                Hjelpemidler på avtale med NAV
              </Heading>
              <ul className="burgermenu-container__agreemment-list">
                {sortedAgreements.map((agreement) => (
                  <li key={agreement.id}>
                    <Link
                      className="burgermenu-container__link"
                      as={NextLink}
                      href={`/${agreement.id}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <ChevronRightIcon title="Pil mote høyre" fontSize="1.5rem" />
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