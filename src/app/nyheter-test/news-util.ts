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
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news/list?size=${size}`, {
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
  const data = await res.json()
  console.log(data)
  return data}

export async function getNewsPaginated(page: number=0, size: number=9): Promise<NewsPageDTO> {
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })

  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }

  return res.json()
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
