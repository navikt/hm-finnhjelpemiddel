import { logNavigationEvent } from '@/utils/amplitude'
import { useMenuStore } from '@/utils/global-state-util'
import { MagnifyingGlassIcon, MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Button, Hide, Show } from '@navikt/ds-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import AutocompleteSearch from '../components/filters/AutocompleteSearch'
import BurgerMenuContent from './BurgerMenuContent'
import useOnClickOutside from '@/hooks/useOnClickOutside'

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { setMenuOpen: setMenuOpenGlobalState } = useMenuStore()
  const router = useRouter()
  const path = usePathname()

  const outerContainerRef = useRef<HTMLElement>(null)

  useOnClickOutside(outerContainerRef, () => {
    setMenuOpen(false)
  })

  const onSearch = useCallback(
    (searchTerm: string) => {
      setMenuOpen(false)
      const q = new URLSearchParams(window.location.search)
      q.set('term', searchTerm)

      if (path.includes('sok')) {
        logNavigationEvent('søk', 'søk', 'Søk på søkesiden')
      } else if (path === '/') {
        logNavigationEvent('forside', 'søk', 'Søk på forsiden')
      } else {
        logNavigationEvent('annet', 'søk', 'Søk fra annen side')
      }

      router.push('/sok?' + q.toString())
    },
    [router]
  )

  useEffect(() => {
    setMenuOpenGlobalState(menuOpen || searchOpen)
  }, [menuOpen, searchOpen, setMenuOpenGlobalState])

  return (
    <nav className="nav" ref={outerContainerRef}>
      <div className={menuOpen || searchOpen ? 'nav-top-container open' : 'nav-top-container'}>
        <div className="nav-top-container__content main-wrapper--xlarge">
          <div className="nav-top-container__logo-and-search-field">
            <NextLink href="/" className="logo">
              <Image src="/nav-logo.svg" width="50" height="35" alt="Til forsiden" />
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
                    aria-expanded={menuOpen}
                  >
                    Meny
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
