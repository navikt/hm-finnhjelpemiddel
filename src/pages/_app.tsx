import '../styles/globals.scss'

import React, { useEffect } from 'react'
import classNames from 'classnames'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import NextLink from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import reportAccessibility from '../utils/reportAccessibility'

import Footer from '../components/layout/Footer'

function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname()

  useEffect(() => {
    document.activeElement instanceof HTMLElement && document.activeElement.blur()
  }, [pathname])

  return (
    <>
      <Head>
        <title>Oversikt over hjelpemidler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <header>
        <nav className="nav-topp">
          <div className="wip-banner">
            <p>
              Siden er under arbeid <span>&#128119;</span>
            </p>
          </div>
          <div className="nav-topp__content">
            <ul>
              <li>
                <NextLink href="/" className={classNames({ 'nav-topp--active': pathname === '/' })}>
                  <Image src="/nav-logo-red.svg" width="64" height="20" alt="Til forsiden" />
                  <b>Hjelpemiddeloppslag</b>
                </NextLink>
              </li>
              {/*
              Commented out temporarily, until we know for sure we won't include a guided approach
              <li className="nav-veileder">
                <NextLink href="/veileder">
                  <p>Veileder</p>
                </NextLink>
              </li> */}
              <li>
                <NextLink href="/sok" className={classNames({ 'nav-topp--active': pathname === '/sok' })}>
                  <p>Søk</p>
                </NextLink>
              </li>
              <li>
                <NextLink href="/sammenlign" className={classNames({ 'nav-topp--active': pathname === '/sammenlign' })}>
                  Sammenligner
                </NextLink>
              </li>
            </ul>
          </div>
        </nav>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  )
}

reportAccessibility(React)

export default App
