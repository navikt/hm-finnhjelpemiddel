import { useEffect, useRef } from 'react'
import NextLink from 'next/link'
import React, { ReactNode } from 'react'
import { Heading, HGrid, Link, LinkCard, VStack } from '@navikt/ds-react'
import { BevegelseIkon } from '@/app/kategori/icons/BevegelseIkon'

import { TasklistIcon } from '@navikt/aksel-icons'
import styles from './BurgerMenu.module.scss'

interface Props {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  menuButtonRef: React.RefObject<HTMLButtonElement | null>
}

const BurgerMenuContent = ({ menuOpen, setMenuOpen, menuButtonRef }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  //spesifiser prod-ingress for å ikke linke til ansatt-forside fra gjenbrukssiden
  const baseUrl = process.env.BUILD_ENV === 'prod' ? 'https://finnhjelpemiddel.nav.no' : ''
  useEffect(() => {
    if (menuOpen) {
      const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus()
      }
    }
  }, [menuOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || e.shiftKey) return
      const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return
      const last = focusableElements[focusableElements.length - 1]
      if (document.activeElement === last) {
        e.preventDefault()
        setMenuOpen(false)
        // Focus the button directly, synchronously before re-render removes the menu
        menuButtonRef.current?.focus()
      }
    }
    if (menuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen, setMenuOpen, menuButtonRef])

  return (
    <>
      {menuOpen && (
        <div className="burgermenu-container" ref={containerRef}>
          <div className="burgermenu-container__content">
            <HGrid
              columns={{ xs: 1, md: 2, lg: 3 }}
              gap={{ xs: 'space-32', md: 'space-32' }}
              padding={{ xs: 'space-16', md: 'space-48', lg: 'space-96' }}
            >
              <VStack gap={{ xs: 'space-4', md: 'space-4' }}>
                <Heading level="2" size="small">
                  Søke om hjelpemiddel
                </Heading>
                <VStack as={'ul'} gap={{ xs: 'space-16' }}>
                  <li>
                    <Link
                      as={NextLink}
                      href={'https://www.nav.no/om-hjelpemidler#hvordan'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Hvordan søke om hjelpemiddel
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={'https://www.nav.no/soknader'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Søknad og skjema for hjelpemidler
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={baseUrl + '/om-nettstedet'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Om Finnhjelpemiddel
                    </Link>
                  </li>
                </VStack>
              </VStack>

              <VStack gap={{ xs: 'space-4', md: 'space-4' }}>
                <Heading level="2" size="small">
                  Snarveier
                </Heading>
                <VStack as={'ul'} gap={{ xs: 'space-16' }}>
                  <li>
                    <Link
                      as={NextLink}
                      href={'https://www.nav.no/kontaktoss'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Kontakt Nav
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={'https://www.nav.no/kontaktoss#finn-hjelpemiddelsentral'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Finn din hjelpemiddelsentral
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={'https://www.kunnskapsbanken.net/'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Kunnskapsbanken
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={baseUrl + '/gjenbruksprodukter'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      For Nav-ansatte: Alternativer på lager
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={baseUrl + '/til-leverandorer'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      For leverandører
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={baseUrl + '/leverandorer'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Leverandøroversikt
                    </Link>
                  </li>
                  <li>
                    <Link
                      as={NextLink}
                      href={baseUrl + '/adminregister'}
                      onClick={() => {
                        setMenuOpen(false)
                      }}
                    >
                      Leverandør innlogging
                    </Link>
                  </li>
                </VStack>
              </VStack>

              <VStack gap={{ xs: 'space-4', md: 'space-8' }}>
                <VStack as={'ul'} gap={{ xs: 'space-16' }}>
                  <li>
                    <LinkCardMenu
                      title="Avtaler med Nav"
                      link={baseUrl + '/rammeavtale'}
                      icon={<TasklistIcon fontSize={'56px'} color={'#B65681'} />}
                      setMenuOpen={setMenuOpen}
                    />
                  </li>
                  <li>
                    <LinkCardMenu
                      title="Alle kategorier"
                      link={baseUrl + '/kategori'}
                      icon={<BevegelseIkon />}
                      setMenuOpen={setMenuOpen}
                    />
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

const LinkCardMenu = ({
  title,
  link,
  icon,
  setMenuOpen,
}: {
  title: string
  link: string
  description?: string
  icon?: ReactNode | undefined
  setMenuOpen: (open: boolean) => void
}) => {
  return (
    <LinkCard
      arrow={false}
      data-color={'accent'}
      onClick={() => {
        setMenuOpen(false)
      }}
    >
      {icon && (
        <VStack justify="center" height="100%" asChild>
          <LinkCard.Icon>{icon}</LinkCard.Icon>
        </VStack>
      )}
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href={link} className={styles.linkText}>
            {title}
          </NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
    </LinkCard>
  )
}

export default BurgerMenuContent
