'use client'

import { BodyLong, Heading, HGrid, HStack, VStack, Page, Search, Chips } from '@navikt/ds-react'
import { NewsDTO } from '@/app/aktuelt/news-util'
import NewsCard from '@/app/aktuelt/NewsCard'
import NewsPagination from '@/app/aktuelt/NewsPagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type NewsProps = {
  news?: NewsDTO[]
  totalPages: number
  currentPage: number
  allTags: string[]
}

export default function NewsGridPage({ news, currentPage, totalPages, allTags }: NewsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedTags = searchParams.getAll('tag')
  const [inputValue, setInputValue] = useState(searchParams.get('search') ?? '')

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setInputValue('')
    handleSearch('')
  }

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag]
    const params = new URLSearchParams(searchParams.toString())
    params.delete('tag')
    params.delete('page')
    next.forEach((t) => params.append('tag', t))
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Page>
      <Page.Block gutters>
        <HStack justify={'center'} padding={'space-16'}>
          <VStack gap={'space-32'} style={{ width: '100%', maxWidth: '1200px' }}>
            <Heading size="large" level="1">
              Aktuelt
            </Heading>
            <VStack gap={'space-16'} style={{ width: '100%', maxWidth: '1200px' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(inputValue) }}>
                <Search
                  label="Søk etter saker"
                  variant="secondary"
                  hideLabel={false}
                  value={inputValue}
                  onChange={setInputValue}
                  onClear={handleClear}
                  onSearchClick={() => handleSearch(inputValue)}
                />
              </form>
              {allTags.length > 0 && (
                <Chips>
                  {allTags.map((tag) => (
                    <Chips.Toggle key={tag} selected={selectedTags.includes(tag)} onClick={() => toggleTag(tag)}>
                      {tag}
                    </Chips.Toggle>
                  ))}
                </Chips>
              )}
            </VStack>
            <HGrid gap={'space-20'} columns={{ xs: 1, sm: 2, md: 3 }}>
              {news?.map((item) => (
                <NewsCard news={item} key={item.id} searchQuery={searchParams.toString()} />
              ))}
              {news && news.length === 0 && <BodyLong>Ingen saker matchet søket ditt.</BodyLong>}
            </HGrid>
            {totalPages > 1 && (
              <HStack justify="center">
                <NewsPagination currentPage={currentPage} totalPages={totalPages} />
              </HStack>
            )}
          </VStack>
        </HStack>
      </Page.Block>
    </Page>
  )
}
