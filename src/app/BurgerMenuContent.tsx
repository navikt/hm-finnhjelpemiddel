import NextLink from 'next/link'
import { useMemo } from 'react'
import useSWR from 'swr'

import { agreementHasNoProducts, AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { logNavigationEvent } from '@/utils/amplitude'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { Heading, HGrid, Link, VStack } from '@navikt/ds-react'

interface Props {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
}

const BurgerMenuContent = ({ menuOpen, setMenuOpen }: Props) => {
  const { data: agreements } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const sortedAgreements = useMemo(() => {
    if (!agreements) return []
    const filteredData = agreements.filter((agreement) => !agreementHasNoProducts(agreement.identifier))
    // Create a copy of data to avoid modifying it in place
    filteredData.sort((a, b) => sortAlphabetically(a.title, b.title))

    return filteredData
  }, [agreements])

  return (
    <>
      {menuOpen && (
        <div className="burgermenu-container">
          <div className="burgermenu-container__content main-wrapper--large">
            <HGrid columns={{ xs: 1, md: '4fr 3fr' }} gap={{ xs: '8', md: '16' }}>
              <VStack gap={{ xs: '1', md: '1' }}>
                <Heading level="2" size="small">
                  AVTALER
                </Heading>
                <ol className="burgermenu-container__category-list">
                  {sortedAgreements.map((agreement) => (
                    <li key={agreement.id}>
                      <Link
                        as={NextLink}
                        href={agreementProductsLink(agreement.id)}
                        onClick={() => {
                          setMenuOpen(false)
                          logNavigationEvent('meny', 'hurtigoversikt', agreement.title)
                        }}
                      >
                        {agreement.title}
                      </Link>
                    </li>
                  ))}
                </ol>

                {/* <ul className="burgermenu-container__category-list">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <HGrid gap="6" columns={'50px auto'}>
                        <div className="burgermenu-container__category-icon">{category.icon}</div>
                        <Link
                          as={NextLink}
                          href={category.link}
                          onClick={() => {
                            setMenuOpen(false)
                            logNavigationEvent('meny', 'rammeavtale', 'Avtaler med Nav')
                          }}
                        >
                          {category.name}
                        </Link>
                      </HGrid>
                    </li>
                  ))}
                </ul> */}
              </VStack>

              <VStack gap={{ xs: '1', md: '2' }}>
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
                        logNavigationEvent('meny', 'rammeavtale', 'Avtaler med Nav')
                      }}
                    >
                      Avtaler med Nav
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
                          'Slik kan du se at et hjelpemiddel er på avtale med Nav'
                        )
                      }}
                    >
                      Slik kan du se at et hjelpemiddel er på avtale med Nav
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

export default BurgerMenuContent
