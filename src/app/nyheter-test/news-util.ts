import { CustomError } from '@/utils/api-util'
import { mapAllNews, News } from '@/utils/news-util'

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

  return res.json()
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


export interface NewsDTO {
  id: string
  title: string
  description: string
  body: string
  created: string
  updated: string
  publishedFrom: string
  publishedTo: string
}
