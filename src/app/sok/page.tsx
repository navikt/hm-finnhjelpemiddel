import React from 'react'

import { Metadata } from 'next'
import SearchPage from './SearchPage'

export const metadata: Metadata = {
  title: 'Søk',
  description: 'Søk etter produkter',
  icons: [{ rel: 'icon', type: 'image/x-icon', url: 'favicon.ico', sizes: 'any' }],
}

export default function Page() {
  return <SearchPage />
}
