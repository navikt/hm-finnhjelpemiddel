'use client'

import { BodyLong, Heading, HGrid, HStack, VStack, Page, Search } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import NewsCard from '@/app/nyheter-test/NewsCard'
import NewsPagination from '@/app/nyheter-test/NewsPagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type NewsProps = {
  news?: NewsDTO[]
  totalPages: number,
  currentPage: number
}

export default function NewsGridPage({ news, currentPage, totalPages }: NewsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('term') ?? ''

  const updateSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (term) {
      params.set('term', term)
    } else {
      params.delete('term')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const filteredNews = news?.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Page>
      <Page.Block as="main" gutters>
        <HStack justify={'center'} padding={'space-16'}>
          <VStack gap={'space-8'} style={{ width: '100%', maxWidth: '1200px' }}>
            <Heading size="large" level="1">
              Nyheter
            </Heading>
            <Search
              label="Søk etter nyheter"
              variant="secondary"
              hideLabel={false}
              value={searchTerm}
              onChange={updateSearch}
              onClear={() => updateSearch('')}
            />
            <HGrid gap={'space-20'} columns={{ xs: 1, sm: 2, md: 3 }}>
              {filteredNews?.map((item) => (
                <NewsCard news={item} key={item.id} />
              ))}
              {filteredNews && filteredNews.length === 0 && <BodyLong>Ingen nyheter matchet søket ditt.</BodyLong>}
            </HGrid>
            <HStack justify={"center"} paddingBlock={'space-16'}>
              <NewsPagination currentPage={currentPage} totalPages={totalPages}></NewsPagination>
            </HStack>
          </VStack>
        </HStack>
      </Page.Block>
    </Page>
  )
}
