'use client'
import { Heading } from '@/components/aksel-client'
import useSWR from 'swr'
import { NewsSelectedResponse } from '@/utils/response-types'
import { getNews } from '@/utils/api-util'
import { useMemo } from 'react'
import { sortAlphabetically } from '@/utils/sort-util'
import { Accordion } from '@navikt/ds-react'
import { dateToString } from '@/utils/string-util'

function Nyhet() {
  const { data, error } = useSWR<NewsSelectedResponse[]>('/news/_search', getNews, {
    keepPreviousData: true,
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place
    sorted.sort((a, b) => sortAlphabetically(a.identifier, b.identifier))

    return sorted
  }, [data])
  const newsMigrationDate = new Date('February 01, 2024')

  return (
    <div>
      <Heading level="1" size="large" spacing>
        Nyheter
      </Heading>
      {data &&
        sortedData.map((news) => (
          <div key={news.identifier}>
            {news.created >= newsMigrationDate && (
              <Accordion key={news.identifier}>
                <Accordion.Item>
                  <Accordion.Header>{news.title}</Accordion.Header>
                  <Accordion.Content>
                    Id: {news.identifier}
                    <br />
                    Author: {news.author}
                    <br />
                    Created: {dateToString(news.created)}
                    <br />
                    Published: {dateToString(news.published)}
                    <br />
                    Expired: {dateToString(news.expired)}
                    <br />
                    {/*                    {news.text}*/}
                    <div dangerouslySetInnerHTML={{ __html: news.text }} />
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion>
            )}
          </div>
        ))}
    </div>
  )
}

export default Nyhet
