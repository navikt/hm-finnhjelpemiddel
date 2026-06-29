import NewsStack from '@/app/nyheter-test/NewsStack'
import { getNews, NewsDTO } from '@/app/nyheter-test/news-util'
import NewsVstack from '@/app/nyheter-test/NewsVstack'
import useSWR from 'swr'

export default function NewsStackWrapper() {
  const { data: news } = useSWR<NewsDTO[]>('news', () => getNews(3))

  return <NewsVstack news={news} />
}
