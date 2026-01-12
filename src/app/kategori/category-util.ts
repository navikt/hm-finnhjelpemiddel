import { CustomError } from '@/utils/api-util'

const HM_FINNHJELPEMIDDEL_BFF_URL = process.env.HM_FINNHJELPEMIDDEL_BFF_URL || ''

export interface Category {
  id: string
  data: { name: string }
  created: string
}

export async function getCategories(): Promise<Category[]> {
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
