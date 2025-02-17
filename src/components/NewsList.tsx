'use client'
import { getNews } from '@/utils/api-util'
import { News } from '@/utils/news-util'
import { Heading, VStack } from '@navikt/ds-react'
import useSWR from 'swr'

const NewsList = () => {
  const { data } = useSWR<News[]>('/news/_search', () => getNews(), {
    keepPreviousData: true,
  })

  const type = (news: News): [string, string] | string => {
    const splitTitle = news.title.split(':')
    return splitTitle.length > 1 ? [news.title.split(':')[0], news.title.split(':')[1]] : news.title
  }

  return (
    <VStack gap={{ xs: '6', md: '8' }}>
      <Heading level="2" size="medium">
        Siste nytt
      </Heading>
      <VStack gap="6" className="spacing-bottom--xlarge">
        {data &&
          data.map((news) => (
            <div className="home-page__news" key={news.id}>
              <VStack gap="1">
                <Heading level="3" size="small" spacing>
                  {Array.isArray(type(news)) ? type(news)[0] : type(news)}
                </Heading>

                {Array.isArray(type(news)) && (
                  <Heading level="4" size="small" spacing>
                    {type(news)[1]}
                  </Heading>
                )}

                <div dangerouslySetInnerHTML={{ __html: news.text }} />
              </VStack>
            </div>
          ))}
      </VStack>
    </VStack>
  )
}

export default NewsList
