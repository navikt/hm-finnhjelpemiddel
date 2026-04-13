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
}

export default async function Page(props: Props) {
  const normalizedCategory = normalizeCategoryTitle((await props.params).kategori)

  const category = await getCategoryByTitle(normalizedCategory)

  if (category.data.isos?.length) {
    return <CategoryPage category={category} />
  }

  return <SubCategoryPage category={category} />
}

const normalizeCategoryTitle = (categoryTitle: string) => {
  return decodeURIComponent(categoryTitle.charAt(0).toUpperCase() + categoryTitle.slice(1))
}
