import { Hit, NewsResponse, SearchResponse } from '@/utils/response-types'

export const mapAllNews = (data: SearchResponse): News[] => {
  return data.hits.hits.map((hit: Hit) => {
    return mapNews(hit._source as unknown as NewsResponse)
  })
}

export const mapNews = (source: NewsResponse): News => {
  return {
    id: source.id,
    identifier: source.identifier,
    title: source.title,
    text: source.text,
    status: source.status,
    expired: new Date(source.expired) ?? '',
    published: new Date(source.published) ?? '',
  }
}

export interface News {
  id: string
  identifier: string
  title: string
  text: string
  status: 'INACTIVE' | 'ACTIVE'
  published: Date //date
  expired: Date //date
}
