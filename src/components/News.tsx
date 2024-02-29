'use client'
import { Box, Heading, VStack } from '@navikt/ds-react'
import useSWR from 'swr'
import { News } from '@/utils/response-types'
import { getNews } from '@/utils/api-util'
import { Fragment, useMemo } from 'react'
import { sortAlphabetically } from '@/utils/sort-util'

function News() {
  const { data, error } = useSWR<News[]>('/news/_search', getNews, {
    keepPreviousData: true,
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place
    sorted.sort((a, b) => sortAlphabetically(a.published.toString(), b.published.toString()))

    return sorted
  }, [data])

  const newsMigrationDate = new Date('February 01, 2024')

  return (
    <>
      <Heading level="2" size="medium" align="center" className="spacing-bottom--large">
        Nyheter
      </Heading>
      <VStack gap="6" align="center" className="spacing-bottom--xlarge">
        {data &&
          sortedData.map((news) => (
            <Fragment key={news.identifier}>
              {news.published.getTime() >= newsMigrationDate.getTime() && news.expired >= new Date(Date.now()) && (
                <Box padding="6" background="surface-default" borderRadius="large" style={{ maxWidth: '690px' }}>
                  <VStack gap="1">
                    <Heading level="3" size="small" spacing>
                      {news.title}
                    </Heading>
                    <div dangerouslySetInnerHTML={{ __html: news.text }} />
                  </VStack>
                </Box>
              )}
            </Fragment>
          ))}
      </VStack>
    </>
  )
}

export default News
