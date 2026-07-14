import { CustomError } from '@/utils/api-util'
import { SparklesIcon, DocPencilIcon, NewsletterIcon } from '@navikt/aksel-icons'
import type { TagProps } from '@navikt/ds-react'

const HM_FINNHJELPEMIDDEL_NEWS_URL = process.env.HM_FINNHJELPEMIDDEL_NEWS_URL || ''

export async function getNews(size: number = 4): Promise<NewsDTO[]> {
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news/?size=${size}`, {
    method: 'GET',
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
  })
  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }
  return res.json()
}

export enum PublishingState {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum NewsTag {
  NYHETSBREV = 'nyhetsbrev',
  RAMMEAVTALE = 'rammeavtale',
  NY_FUNKSJON = 'ny funksjon',
}

export const newsTagMeta: Record<NewsTag, { icon: typeof DocPencilIcon; color: TagProps['data-color'] }> = {
  [NewsTag.NYHETSBREV]: { icon: NewsletterIcon, color: 'info' },
  [NewsTag.RAMMEAVTALE]: { icon: DocPencilIcon, color: 'danger' },
  [NewsTag.NY_FUNKSJON]: { icon: SparklesIcon, color: 'warning' },
}

export async function getNewsPaginated(
  page: number = 0,
  size: number = 9,
  tag: string[] = [],
  search: string = '',
  publishingState: PublishingState[] = []
): Promise<NewsPageDTO> {
  const params = new URLSearchParams({ page: String(page), size: String(size) })
  tag.forEach((t) => params.append('tag', t))
  if (search) params.set('search', search)
  publishingState.forEach((s) => params.append('publishingState', s))
  const res = await fetch(`${HM_FINNHJELPEMIDDEL_NEWS_URL}/news?${params}`, {
    method: 'GET',
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
    })
  if (!res.ok) {
    throw new CustomError(res.statusText, res.status)
  }
  const data: { tag: string }[] = await res.json()
  return data.map(t => t.tag)
}

export const formatPublishedDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })

export interface NewsDTO {
  id: string
  title: string
  description: string
  body: string
  created: string
  updated: string
  publishedFrom: string
  publishedTo: string
  imageUrl: string
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
