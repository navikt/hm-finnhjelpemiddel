import NewsStack from '@/app/nyheter-test/NewsStack'
import { getAllNews } from '@/app/nyheter-test/news-util'
import { getNews } from '@/app/nyheter-test/news-util'
import NewsGridPage from '@/app/nyheter-test/NewsGridPage'

export default async function Page() {
  const news = await getAllNews()

  //return <NewsStack news={news}/>
  return <NewsGridPage news={news} />
}
