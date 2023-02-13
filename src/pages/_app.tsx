import '../styles/globals.scss'
import '../styles/comparing-table.scss'
import '../styles/range-filter-input.scss'
import '../styles/search.scss'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component {...pageProps} key={router.asPath} />
    </AnimatePresence>
  )
}
