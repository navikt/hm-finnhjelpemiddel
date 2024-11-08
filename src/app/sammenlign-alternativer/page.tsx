import { Metadata } from 'next'
import { Suspense } from 'react'
import CompareAlternativesPage from "@/app/sammenlign-alternativer/CompareAlternativesPage";

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
}

export default function Page() {
  return (
    <Suspense>
      <CompareAlternativesPage />
    </Suspense>
  )
}
