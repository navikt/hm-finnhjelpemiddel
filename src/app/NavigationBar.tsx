import { Button, Hide, Show } from '@navikt/ds-react'
import Image from 'next/image'
import { MagnifyingGlassIcon, MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import NextLink from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import BurgerMenuContent from './BurgerMenuContent'
import AutocompleteSearch from '../components/filters/AutocompleteSearch'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useMenuStore } from '@/utils/global-state-util'

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { setMenuOpen: setMenuOpenGlobalState } = useMenuStore()

  const router = useRouter()

  const onSearch = useCallback(
    (searchTerm: string) => {
      setMenuOpen(false)
      router.push('/sok?term=' + searchTerm)
    },
    [router]
  )

  useEffect(() => {
    setMenuOpenGlobalState(menuOpen || searchOpen)
  }, [menuOpen, searchOpen, setMenuOpenGlobalState])

  return (
    <nav className="nav">
      <div className={menuOpen || searchOpen ? 'nav-top-container open' : 'nav-top-container'}>
        <div className="nav-top-container__content main-wrapper--xlarge">
          <div className="nav-top-container__logo-and-search-field">
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
                  variant="tertiary-neutral"
                  onClick={() => setSearchOpen(!searchOpen)}
                />
              )}
            </Show>
            {!searchOpen && (
              <>
                <Hide below="md">
                  <Button
                    icon={menuOpen ? <XMarkIcon title="Lukk menyen" /> : <MenuHamburgerIcon title="Åpne menyen" />}
                    variant="tertiary-neutral"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    Avtale med NAV
                  </Button>
                </Hide>
                <Show below="md" asChild>
                  <Button
                    icon={menuOpen ? <XMarkIcon title="Lukk menyen" /> : <MenuHamburgerIcon title="Åpne menyen" />}
                    variant="tertiary-neutral"
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
          setMenuOpen={setMenuOpen}
          setSearchOpen={setSearchOpen}
        />
      </div>
    </nav>
  )
}

export default NavigationBar
