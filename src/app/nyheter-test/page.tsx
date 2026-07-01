import { getNews } from '@/app/nyheter-test/news-util'
import NewsVstack from '@/app/nyheter-test/NewsVstack'

export default async function Page() {
  const news = await getNews(3)

  return <NewsVstack news={news} />
}
