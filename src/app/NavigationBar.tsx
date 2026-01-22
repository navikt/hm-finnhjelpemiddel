import AutocompleteSearch from '@/components/AutocompleteSearch'
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut'
import useOnClickOutside from '@/hooks/useOnClickOutside'
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
import { Pepperkakemann } from '@/app/julepynt/Pepperkakemann'

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const searchParamValue = searchParams.get('term')
  const [searchOpen, setSearchOpen] = useState(searchParamValue !== '' && searchParamValue !== null)

  const featureFlags = useFeatureFlags()
  const juledekorasjonFlag = featureFlags.isEnabled('juledekorasjon')
  const [visJulepynt, setVisJulepynt] = useState(false)

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
        router.push('/sok?' + qWithFilters.toString())
      } else if (path === '/') {
        router.push('/sok?' + qWithFilters.toString())
      } else if (path.includes('produkt')) {
        router.push('/sok?' + qNoFilters.toString())
      } else {
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

          {juledekorasjonFlag && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                alignContent: 'flex-start',
                marginRight: 'auto',
                paddingLeft: '1rem',
              }}
            >
              <Hide below="md">
                <Button
                  size="medium"
                  variant="tertiary-neutral"
                  icon={<Pepperkakemann active={visJulepynt} />}
                  onClick={() => setVisJulepynt(!visJulepynt)}
                  title={'Pepperkake'}
                ></Button>
              </Hide>
              <Hide above="sm">
                <Button
                  size="xsmall"
                  variant="tertiary-neutral"
                  icon={<Pepperkakemann active={visJulepynt} />}
                  onClick={() => setVisJulepynt(!visJulepynt)}
                  title={'Pepperkake'}
                ></Button>
              </Hide>
            </div>
          )}

          <div className="nav-top-container__menu-buttons-container">
            <HStack wrap={false}>
              {searchOpen && (
                <div className="nav-top-container_search">
                  <AutocompleteSearch onSearch={onSearch} secondary autofocus={true} />
                </div>
              )}
              {searchOpen ? (
                <Button
                  className="nav-top-container__search-button"
                  icon={<XMarkIcon aria-hidden />}
                  aria-label={'Fjern'}
                  variant="tertiary"
                  onClick={() => {
                    console.log('aaaaaa')
                    removeSearchTerm()
                  }}
                  aria-expanded={searchOpen}
                ></Button>
              ) : (
                <Button
                  className="nav-top-container__search-button"
                  icon={<MagnifyingGlassIcon aria-hidden />}
                  aria-label={'Søk'}
                  variant="tertiary"
                  onClick={() => {
                    setSearchOpen(!searchOpen)
                  }}
                  aria-expanded={searchOpen}
                >
                  Søk
                </Button>
              )}
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
