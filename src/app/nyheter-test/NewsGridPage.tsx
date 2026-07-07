'use client'

import { BodyLong, Heading, HGrid, HStack, VStack, Page, Search, Chips } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import NewsCard from '@/app/nyheter-test/NewsCard'
import NewsPagination from '@/app/nyheter-test/NewsPagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('page')
      if (inputValue) {
        params.set('search', inputValue)
      } else {
        params.delete('search')
      }
      router.replace(`${pathname}?${params.toString()}`)
    }, 300)
    return () => clearTimeout(timeout)
  }, [inputValue])

  const handleClear = () => {
    setInputValue('')
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
      <Page.Block as="main" gutters>
        <HStack justify={'center'} padding={'space-16'}>
          <VStack gap={'space-8'} style={{ width: '100%', maxWidth: '1200px' }}>
            <Heading size="large" level="1">
              Aktuelt
            </Heading>
            <Search
              label="Søk etter saker"
              variant="secondary"
              hideLabel={false}
              value={inputValue}
              onChange={setInputValue}
              onClear={handleClear}
            />
            {allTags.length > 0 && (
              <Chips>
                {allTags.map((tag) => (
                  <Chips.Toggle
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Chips.Toggle>
                ))}
              </Chips>
            )}
            <HGrid gap={'space-20'} columns={{ xs: 1, sm: 2, md: 3 }}>
              {news?.map((item) => (
                <NewsCard news={item} key={item.id} />
              ))}
              {news && news.length === 0 && <BodyLong>Ingen saker matchet søket ditt.</BodyLong>}
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
