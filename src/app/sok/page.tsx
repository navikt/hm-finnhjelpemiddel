import { Suspense } from 'react'

import { Metadata } from 'next'
import SearchPage from './SearchPage'

export const metadata: Metadata = {
  title: 'Søk',
  description: 'Søk etter produkter',
}

export default function Page() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  )
}
