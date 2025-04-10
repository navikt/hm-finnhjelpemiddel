import AutocompleteSearch from '@/components/AutocompleteSearch'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import { digihot_customevents, logCustomEvent, logNavigationEvent } from '@/utils/amplitude'
import { useMenuStore } from '@/utils/global-state-util'
import { MagnifyingGlassIcon, MenuHamburgerIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Button, Hide, HStack, Show } from '@navikt/ds-react'
import Image from 'next/image'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BurgerMenuContent from './BurgerMenuContent'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { SnowfallComponent } from '@/components/Snowfall'
import { KyllingHareFall } from '@/app/pynt/KyllingHareFall'
import { Pynt } from '@/app/pynt/Pynt'

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const searchParamValue = searchParams.get('term')
  const [searchOpen, setSearchOpen] = useState(searchParamValue !== '' && searchParamValue !== null)

  const featureFlags = useFeatureFlags()
  const juledekorasjonFlag = featureFlags.isEnabled('juledekorasjon')
  const [visJulepynt, setVisJulepynt] = useState(false)
  const clickJulepynt = () => {
    setVisJulepynt(!visJulepynt)
    logCustomEvent(digihot_customevents.PEPPERKAKE)
  }

  const pynteTimer = () => {
    setTimeout(() => {
      setVisPaaskepynt(false)
    }, 6000)
  }

  const paaskepyntFlag = featureFlags.isEnabled('paaskepynt')
  const [visPaaskepynt, setVisPaaskepynt] = useState(false)
  const clickPaaskepynt = () => {
    setVisPaaskepynt(!visPaaskepynt)
    if (!visPaaskepynt) pynteTimer()
    logCustomEvent(digihot_customevents.PAASKE)
  }

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
    setMenuOpenGlobalState(menuOpen)
  }, [menuOpen, setMenuOpenGlobalState])

  useEffect(() => {
    setSearchOpen(searchParamValue !== '' && searchParamValue !== null)
  }, [path, searchParamValue])

  useKeyboardShortcut({
    key: 'Escape',
    onKeyPressed: () => setMenuOpen(false),
  })

  const removeSearchTerm = () => {
    const qWithFilters = new URLSearchParams(window.location.search)
    qWithFilters.set('term', '')

    const currentHash = window.location.hash
    router.replace(`${path}?${qWithFilters}${currentHash ? currentHash : ''}`, {
      scroll: false,
    })
  }

  //spesifiser prod-ingress for å ikke linke til ansatt-forside fra gjenbrukssiden
  const homeUrl = process.env.BUILD_ENV === 'prod' ? 'https://finnhjelpemiddel.nav.no/' : '/'

  return (
    <nav className="nav" ref={outerContainerRef}>
      {juledekorasjonFlag && visJulepynt && <SnowfallComponent />}
      {paaskepyntFlag && visPaaskepynt && <KyllingHareFall />}
      <div className={menuOpen ? 'nav-top-container open' : 'nav-top-container'}>
        <div className="nav-top-container__content main-wrapper--xlarge">
          <NextLink href={homeUrl} className="logo" onClick={() => setMenuOpen(false)}>
            <Image src="/nav-logo-red.svg" width="60" height="35" alt="Til forsiden" />
            <Hide below="sm">
              <span className="logo__text">
                <span>FinnHjelpemiddel</span>
              </span>
            </Hide>
          </NextLink>

          {juledekorasjonFlag && <Pynt vis={visJulepynt} clickPynt={clickJulepynt} pyntType={'jul'} />}
          {paaskepyntFlag && <Pynt vis={visPaaskepynt} clickPynt={clickPaaskepynt} pyntType={'paaske'} />}
          <div className="nav-top-container__menu-buttons-container">
            <HStack wrap={false}>
              {searchOpen && (
                <div className="nav-top-container_search">
                  <AutocompleteSearch onSearch={onSearch} secondary />
                </div>
              )}
              <Button
                className="nav-top-container__search-button"
                icon={searchOpen ? <XMarkIcon aria-hidden /> : <MagnifyingGlassIcon aria-hidden />}
                aria-label={searchOpen ? 'Fjern' : 'Søk'}
                variant="tertiary"
                onClick={() => {
                  if (searchOpen) {
                    removeSearchTerm()
                  }
                  setSearchOpen(!searchOpen)
                }}
                aria-expanded={searchOpen}
              >
                {searchOpen ? '' : 'Søk'}
              </Button>
            </HStack>

            <>
              <Hide below="md">
                <Button
                  icon={menuOpen ? <XMarkIcon aria-hidden /> : <MenuHamburgerIcon aria-hidden />}
                  variant="tertiary"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-expanded={menuOpen}
                >
                  Meny
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
          </div>
        </div>
        <BurgerMenuContent menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      </div>
    </nav>
  )
}

export default NavigationBar
