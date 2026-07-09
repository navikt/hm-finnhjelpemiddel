import { CustomError } from '@/utils/api-util'

const HM_FINNHJELPEMIDDEL_NEWS_URL = process.env.HM_FINNHJELPEMIDDEL_NEWS_URL || ''

export async function getAllNews(): Promise<NewsDTO[]> {
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }

  const data = await res.json()
  return data.content ?? data
}

export async function getNews(size: number = 4): Promise<NewsDTO[]> {
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news/?size=4`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }

  const data = await res.json()
  return data.content ?? data
}

export async function getNewsById(id: string): Promise<NewsDTO | null> {
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news/${id}`, {
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

export async function getNewsPaginated(
  page: number = 0,
  size: number = 9,
  tag: string[] = [],
  search: string = ''
): Promise<NewsPageDTO> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  tag.forEach((t) => params.append('tag', t))
  if (search) params.set('search', search)
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news?${params}`, {
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

export async function getAllTags(): Promise<string[]> {
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/admin/tags/`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }
  const data: { tag: string }[] = await res.json()
  return data.map(t => t.tag)
}

export interface NewsDTO {
  id: string
  title: string
  description: string
  body: string
  created: string
  updated: string
  publishedFrom: string
  publishedTo: string
  image_url: string
  imageDescription: string
  tags: string[]
}

export interface NewsPageDTO {
  content: NewsDTO[]
  totalSize: number,
  pageable: {
    number: number,
    size: number
  }
}
