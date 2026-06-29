import NewsStack from '@/app/nyheter-test/NewsStack'
import { getNews } from '@/app/nyheter-test/news-util'


export default async function Page() {
  const news = await getNews(3)

  return <NewsStack news={news} />
}
