import { logNavigationEvent } from '@/utils/amplitude'
import { categories } from '@/utils/category-util'
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
                  {categories.map((category) => (
                    <li key={category.name}>
                      <HGrid gap="6" columns={'50px auto'}>
                        <div className="burgermenu-container__category-icon">{category.icon}</div>
                        <Link
                          as={NextLink}
                          href={category.link}
                          onClick={() => {
                            setMenuOpen(false)
                          }}
                        >
                          {category.name}
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

export default BurgerMenuContent
