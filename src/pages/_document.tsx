import { Html, Head, Main, NextScript } from 'next/document'
import NextLink from 'next/link'
import Image from 'next/image'
import Footer from '../components/layout/Footer'

export default function Document() {
  return (
    <Html lang="no">
      <Head />
      <body>
        <div className="wip-banner">
          <p>
            Siden er under arbeid <span>&#128119;</span>
          </p>
        </div>
        <nav className="nav-topp">
          <div className="nav-topp__content">
            <ul>
              <li>
                <NextLink href="/">
                  <Image src="/nav-logo-red.svg" width="64" height="20" alt="Til forsiden" />
                  <b>Hjelpemiddeloversikten</b>
                </NextLink>
              </li>
              <li className="nav-veileder">
                <NextLink href="/veileder">
                  <p>Veileder</p>
                </NextLink>
              </li>
              <li className="nav-compare">
                <NextLink href="/sammenlign">
                  <p>Sammenligner</p>
                </NextLink>
              </li>
            </ul>
          </div>
        </nav>
        <main>
          <Main />
        </main>
        <Footer />
        <NextScript />
      </body>
    </Html>
  )
}