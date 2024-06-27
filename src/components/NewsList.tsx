'use client'
import { getNews } from '@/utils/api-util'
import { News } from '@/utils/news-util'
import { Heading, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'
import useSWR from 'swr'

const NewsList = () => {
  const { data, error } = useSWR<News[]>('/news/_search', getNews, {
    keepPreviousData: true,
  })

  const newsMigrationDate = new Date('April 01, 2024')

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place

    return sorted
      .sort((a, b) => b.published.getTime() - a.published.getTime())
      .filter((news) => news.published.getTime() >= newsMigrationDate.getTime() && news.expired >= new Date(Date.now()))
  }, [data])

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
          sortedData.map((news) => (
            <div className="home-page__news" key={news.identifier}>
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
