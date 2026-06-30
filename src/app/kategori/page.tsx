import { Metadata } from 'next'
import { TopCategoriesPage } from '@/app/kategori/TopCategoriesPage'

export const metadata: Metadata = {
  title: 'Kategorier',
  description: 'Alle hovedkategorier av hjelpemidler',
}

export default async function Page() {
  return <TopCategoriesPage />
}
