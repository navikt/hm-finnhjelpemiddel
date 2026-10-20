import { TopCategoriesPage } from '@/app/kategori/TopCategoriesPage'
import { ISO_VERSION_COOKIE, resolveIsoVersion } from '@/app/kategori/utils/iso-version'

import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Kategorier',
  description: 'Alle hovedkategorier av hjelpemidler',
}

type Props = {
  searchParams: Promise<{ [key: string]: string[] | string | undefined }>
}

export default async function Page(props: Props) {
  const isoVersion = resolveIsoVersion(await props.searchParams, (await cookies()).get(ISO_VERSION_COOKIE)?.value)
  return <TopCategoriesPage isoVersion={isoVersion} />
}
