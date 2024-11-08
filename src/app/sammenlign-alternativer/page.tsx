import CompareAlternativesPage from './CompareAlternativesPage'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sammenligner gjenbruksprodukter',
  description: 'Sammenlign gjenbruksprodukter',
}

export default function Page() {
  return (
    <Suspense>
      <CompareAlternativesPage />
    </Suspense>
  )
}
