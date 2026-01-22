import { CustomError, fetcherModify } from '@/utils/api-util'

const HM_FINNHJELPEMIDDEL_BFF_URL = process.env.HM_FINNHJELPEMIDDEL_BFF_URL || ''

export type Category = {
  description: string | undefined
  subCategories: string[] | undefined
  isos: string[] | undefined
  icon: string | undefined
}

export type CategoryAdminDTO = {
  id: string
  title: string
  data: Category
}

export type CategoryDTO = {
  id: string
  title: string
  subCategories?: { id: string; title: string; icon: string }[]
  data: Category
}

export type EditableCategoryDTO = {
  title: string
  data: Category
}

export async function getCategories(): Promise<CategoryAdminDTO[]> {
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

export async function getCategoryById(id: string): Promise<CategoryAdminDTO> {
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

export async function getCategoryByTitle(title: string): Promise<CategoryDTO> {
  const res = await fetch(HM_FINNHJELPEMIDDEL_BFF_URL + `/category/${title}`, {
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

export async function createCategory(category: EditableCategoryDTO): Promise<void> {
  return await fetcherModify(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category`, 'POST', category)
}

export async function updateCategory(category: EditableCategoryDTO): Promise<void> {
  return await fetcherModify(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category`, 'PUT', category)
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return await fetcherModify(HM_FINNHJELPEMIDDEL_BFF_URL + `/admin/category/id/${categoryId}`, 'DELETE')
}
