import { SubCategoryPage } from '@/app/kategori/[kategori]/SubCategoryPage'
import { getCategoryByTitle, uppercaseCategoryTitle } from '@/app/kategori/admin/category-admin-util'
import { ISO_VERSION_PARAM, resolveIsoVersion } from '@/app/kategori/utils/iso-version'

import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { CategoryPage } from './CategoryPage'

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: normalizeCategoryTitle(params.kategori),
  }
}

type Props = {
  params: Promise<{ kategori: string }>
  searchParams: Promise<{ [key: string]: string[] | string | undefined }>
}

export default async function Page(props: Props) {
  const normalizedCategory = normalizeCategoryTitle((await props.params).kategori)

  const searchParams = await props.searchParams
  const isoVersion = resolveIsoVersion(searchParams.isoVersion, (await cookies()).get(ISO_VERSION_PARAM)?.value)
  const category = await getCategoryByTitle(normalizedCategory, isoVersion)

  const searchParamsMap = new Map<string, (string | undefined)[]>(
    Object.entries(searchParams).map(([key, value]) => {
      if (!Array.isArray(value)) {
        return [key, [value]]
      }
      return [key, value]
    })
  )

  if (category.data.isos?.length) {
    return <CategoryPage category={category} searchParams={searchParamsMap} />
  }

  return <SubCategoryPage category={category} />
}

const normalizeCategoryTitle = (categoryTitle: string) => {
  return decodeURIComponent(uppercaseCategoryTitle(categoryTitle))
}
