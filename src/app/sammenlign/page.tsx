import ComparePage from './ComparePage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
}

export default function Page() {
  return <ComparePage />
}
