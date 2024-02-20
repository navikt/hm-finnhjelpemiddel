import { AgreementLabel, agreementHasNoProducts } from '@/utils/agreement-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { ChevronRightIcon } from '@navikt/aksel-icons'
import { Button, Heading } from '@navikt/ds-react'
import { useCallback, useMemo } from 'react'
import useSWR from 'swr'
import NextLink from 'next/link'
import { getAgreementLabels } from '@/utils/api-util'
import { useRouter } from 'next/navigation'
import AutocompleteSearch from './filters/AutocompleteSearch'

interface Props {
  searchOpen: boolean
  menuOpen: boolean
  setOpenMenu: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
}

const BurgerMenuContent = ({ searchOpen, menuOpen, setOpenMenu, setSearchOpen }: Props) => {
  const { data: agreements } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const router = useRouter()

  const onSearch = useCallback(
    (searchTerm: string) => {
      router.push('/sok?term=' + searchTerm)
    },
    [router]
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
          <div className="burgermenu-container__content">
            <>
              <Heading level="2" size="small">
                Avtale med NAV
              </Heading>
              <ul>
                <li>
                  <NextLink href="/rammeavtale" onClick={() => setOpenMenu(false)}>
                    <Button variant="tertiary" as="a" icon={<ChevronRightIcon title="a11y-title" fontSize="1.5rem" />}>
                      Om avtaler med NAV
                    </Button>
                  </NextLink>
                </li>
              </ul>
              <Heading level="2" size="small">
                Hjelpemidler på avtale med NAV
              </Heading>
              <ul className="burgermenu-container__agreemment-list">
                {sortedAgreements.map((agreement) => (
                  <li key={agreement.id}>
                    <NextLink href={`/${agreement.id}`} onClick={() => setOpenMenu(false)}>
                      <Button variant="tertiary" icon={<ChevronRightIcon title="a11y-title" fontSize="1.5rem" />}>
                        {agreement.label}
                      </Button>
                    </NextLink>
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
