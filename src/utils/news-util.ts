import { Hit, News, SearchResponse } from '@/utils/response-types'

export const mapAllNews = (data: SearchResponse): News[] => {
  return data.hits.hits.map((hit: Hit) => {
    return mapNews(hit._source as unknown as News)
  })
}

export const mapNews = (source: News): News => {
  return {
    id: source.id,
    identifier: source.identifier,
    title: source.title,
    text: source.text,
    status: source.status,
    expired: new Date(source.expired.toString()) ?? '',
    published: new Date(source.published.toString()) ?? '',
  }
}
