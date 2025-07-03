import { Metadata } from 'next'
import { NotFound } from '@/app/[...not-found]/NotFound'

export const metadata: Metadata = {
  title: 'Fant ikke siden',
  description: 'Siden ble ikke funnet',
}

export default function Page() {
  return <NotFound />
}
