import '../styles/comparing-table.scss'
import '../styles/globals.scss'
import '../styles/product-page.scss'
import '../styles/range-filter-input.scss'
import '../styles/search.scss'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Oversikt over hjelpemidler</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <AnimatePresence mode="wait" initial={false}>
        <Component {...pageProps} key={router.asPath} />
      </AnimatePresence>
    </>
  )
}
