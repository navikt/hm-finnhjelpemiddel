import { SupplierPage } from '@/app/leverandorer/SupplierPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leverandører',
  description: 'Liste av leverandører',
}

export default function Page() {
  return <SupplierPage />
}
