import { Button, Hide, Show } from '@navikt/ds-react'
import Image from 'next/image'
import { MagnifyingGlassIcon, MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import NextLink from 'next/link'
import { useCallback, useState } from 'react'
import BurgerMenuContent from './BurgerMenuContent'
import AutocompleteSearch from './filters/AutocompleteSearch'
import { useRouter } from 'next/navigation'

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const router = useRouter()

  const onSearch = useCallback(
    (searchTerm: string) => {
      router.push('/sok?term=' + searchTerm)
    },
    [router]
  )

  return (
    <nav className="nav">
      <div className={menuOpen || searchOpen ? 'nav-top-container open' : 'nav-top-container'}>
        <div className="nav-top-container__content">
          <div className="nav-top-container__logo-search">
            <NextLink href="/" className="logo">
              <Image src="/nav-logo.svg" width="40" height="20" alt="Til forsiden" />
              <span className="logo__text">
                <span>FinnHjelpemiddel</span>
              </span>
            </NextLink>
            <Hide below="md" className="nav-top-container__search">
              <AutocompleteSearch onSearch={onSearch} />
            </Hide>
          </div>

          <div className="nav-top-container__menu-icons">
            <Show below="md" asChild>
              {!menuOpen && (
                <Button
                  className="nav-top-container__search-button"
                  icon={
                    searchOpen ? <XMarkIcon title="Lukk søkefelt" /> : <MagnifyingGlassIcon title="Åpne søkefelt" />
                  }
                  variant="tertiary"
                  onClick={() => setSearchOpen(!searchOpen)}
                />
              )}
            </Show>
            {!searchOpen && (
              <>
                <Hide below="md">
                  <Button
                    icon={menuOpen ? <XMarkIcon title="Lukk menyen" /> : <MenuHamburgerIcon title="Åpne menyen" />}
                    variant="tertiary"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Avtale med NAV
                  </Button>
                </Hide>
                <Show below="md" asChild>
                  <Button
                    icon={menuOpen ? <XMarkIcon title="Lukk menyen" /> : <MenuHamburgerIcon title="Åpne menyen" />}
                    variant="tertiary"
                    onClick={() => setMenuOpen(!menuOpen)}
                  />
                </Show>
              </>
            )}
          </div>
        </div>
        <BurgerMenuContent
          menuOpen={menuOpen}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          setOpenMenu={setMenuOpen}
        />
      </div>
    </nav>
  )
}

export default NavigationBar
