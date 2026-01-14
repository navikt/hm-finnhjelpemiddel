import { CustomError, fetcherModify } from '@/utils/api-util'

const HM_FINNHJELPEMIDDEL_BFF_URL = process.env.HM_FINNHJELPEMIDDEL_BFF_URL || ''

export type Category = {
  name: string
  description: string
  subCategories: string[]
  isos: string[]
  showProducts: boolean
}

export type CategoryDTO = {
  id: string
  data: Category
}

export type CreateCategoryDTO = {
  data: Category
}

export async function getCategories(): Promise<CategoryDTO[]> {
  const res = await fetch(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }

  return res.json()
}

export async function getCategory(id: string): Promise<CategoryDTO> {
  const res = await fetch(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category/id/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }

  return res.json()
}

export async function createCategory(category: CreateCategoryDTO): Promise<void> {
  return await fetcherModify(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category`, 'POST', category)
}

export async function updateCategory(category: CategoryDTO): Promise<void> {
  return await fetcherModify(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category`, 'PUT', category)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return await fetcherModify(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category/id/${categoryId}`, 'DELETE')
}
