import { Html, Head, Main, NextScript } from 'next/document'
import NextLink from 'next/link'
import Image from 'next/image'
import Footer from '../components/Layout/Footer'

export default function Document() {
  return (
    <Html lang="no">
      <Head>
        <title>Oversikt over hjelpemidler 2</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
                <a href="/">
                  <Image src="/nav-logo-red.svg" width="64" height="20" alt="Til forsiden" />
                  <b>Hjelpemiddeloversikten</b>
                </a>
              </li>
              <li className="nav-veileder">
                <a href="/veileder">
                  <p>Veileder</p>
                </a>
              </li>
              <li className="nav-compare">
                <NextLink href="/sammenlign">
                  <p>Sammenligner</p>
                </NextLink>
              </li>
            </ul>
          </div>
        </nav>
        <Main />
        <Footer />
        <NextScript />
      </body>
    </Html>
  )
}
