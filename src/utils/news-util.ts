import { Hit, NewsType, NewsResponse, SearchResponse } from '@/utils/response-types'

export const mapAllNews = (data: SearchResponse): NewsType[] => {
  return data.hits.hits.map((hit: Hit) => {
    return mapNews(hit._source as unknown as NewsResponse)
  })
}

export const mapNews = (source: NewsResponse): NewsType => {
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
