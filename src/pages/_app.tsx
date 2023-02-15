import '../styles/comparing-table.scss'
import '../styles/globals.scss'
import '../styles/product-page.scss'
import '../styles/range-filter-input.scss'
import '../styles/search.scss'

import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Oversikt over hjelpemidler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} key={router.asPath} />
    </>
  )
}
