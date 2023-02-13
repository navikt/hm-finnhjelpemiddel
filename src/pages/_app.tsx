import '../styles/globals.scss'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component {...pageProps} key={router.asPath} />
    </AnimatePresence>
  )
}
