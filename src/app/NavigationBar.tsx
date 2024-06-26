import useOnClickOutside from '@/hooks/useOnClickOutside'
import { logNavigationEvent } from '@/utils/amplitude'
import { useMenuStore } from '@/utils/global-state-util'
import { MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Button, Hide, Show } from '@navikt/ds-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import BurgerMenuContent from './BurgerMenuContent'

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
  //TODO: Bruke useSearchParems her?
  const onSearch = useCallback(
    (searchTerm: string) => {
      setMenuOpen(false)
      const qWithFilters = new URLSearchParams(window.location.search)
      const qNoFilters = new URLSearchParams()

      qWithFilters.set('term', searchTerm.trim())
      qNoFilters.set('term', searchTerm.trim())
      if (path.includes('sok')) {
        logNavigationEvent('søk', 'søk', 'Søk på søkesiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path === '/') {
        logNavigationEvent('forside', 'søk', 'Søk på forsiden')
        router.push('/sok?' + qWithFilters.toString())
      } else if (path.includes('produkt')) {
        router.push('/sok?' + qNoFilters.toString())
      } else {
        logNavigationEvent('annet', 'søk', 'Søk fra annen side')
        router.push('/sok?' + qWithFilters.toString())
      }
    },
    [router, path]
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
              <Image src="/nav-logo-red.svg" width="60" height="35" alt="Til forsiden" />
              <span className="logo__text">
                <span> / </span>
                <span>FinnHjelpemiddel</span>
              </span>
            </NextLink>
          </div>

          <div className="nav-top-container__menu-icons">
            {!searchOpen && (
              <>
                <Hide below="md">
                  <Button
                    icon={menuOpen ? <XMarkIcon aria-hidden /> : <MenuHamburgerIcon aria-hidden />}
                    variant="tertiary"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
                  >
                    Meny og søk
                  </Button>
                </Hide>
                <Show below="md" asChild>
                  <Button
                    icon={menuOpen ? <XMarkIcon aria-hidden /> : <MenuHamburgerIcon aria-hidden />}
                    variant="tertiary"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-expanded={menuOpen}
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
          onSearch={onSearch}
        />
      </div>
    </nav>
  )
}

export default NavigationBar
