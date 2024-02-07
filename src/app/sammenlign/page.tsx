import ComparePage from './ComparePage'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
}

export default function Page() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  )
}
