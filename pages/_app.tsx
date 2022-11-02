import '../styles/globals.css'
import reportAccessibility from '../utils/reportAccessibility'
import type { AppProps } from 'next/app'
import React from 'react'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

reportAccessibility(React)

export default App
