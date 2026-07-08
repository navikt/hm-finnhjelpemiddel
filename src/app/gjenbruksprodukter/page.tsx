import { AlternativeProductsPage } from '@/app/gjenbruksprodukter/AlternativeProductsPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alternativer på lager',
}

export default function Page() {
  return <AlternativeProductsPage />
}
