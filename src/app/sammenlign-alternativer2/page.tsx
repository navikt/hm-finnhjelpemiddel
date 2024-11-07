import CompareAlternativesPage2 from './CompareAlternativesPage2'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
}

export default function Page() {
  return (
    <Suspense>
      <CompareAlternativesPage2 />
    </Suspense>
  )
}
