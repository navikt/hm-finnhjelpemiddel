import { Metadata } from 'next'
import { Access } from '@/app/tilgang/Access'

export const metadata: Metadata = {
  title: 'Ikke tilgang',
  description: 'Brukeren din har ikke tilgang hit',
}

export default function Page() {
  return <Access />
}
