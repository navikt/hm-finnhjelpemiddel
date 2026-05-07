import { CategoryPage } from './CategoryPage'
import { SubCategoryPage } from '@/app/kategori/[kategori]/SubCategoryPage'
import { getCategoryByTitle } from '@/app/kategori/admin/category-admin-util'
import type { Metadata } from 'next'

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  return {
    title: normalizeCategoryTitle(params.kategori),
  }
}

type Props = {
  params: Promise<{ kategori: string }>
  searchParams: Promise<{ [key: string]: string[] | undefined }>
}

export default async function Page(props: Props) {
  const normalizedCategory = normalizeCategoryTitle((await props.params).kategori)

  const category = await getCategoryByTitle(normalizedCategory)

  const entries = new Map<string, string | string[] | undefined>(Object.entries(await props.searchParams))

  // @ts-expect-error
  const entries2 = new Map<string, string[]>(
    Object.entries(await props.searchParams).map(([key, value]) => {
      if (!Array.isArray(value)) {
        return [key, [value]]
      }
      return [key, value]
    })
  )

  if (category.data.isos?.length) {
    return <CategoryPage category={category} searchParams2={entries2} />
  }

  return <SubCategoryPage category={category} />
}

const normalizeCategoryTitle = (categoryTitle: string) => {
  return decodeURIComponent(categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1))
}
