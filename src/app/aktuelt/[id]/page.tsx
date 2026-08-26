import BackButton from '@/app/aktuelt/[id]/BackButton'
import NewsArticleImage from '@/app/aktuelt/[id]/NewsArticleImage'
import { formatPublishedDate, getNewsById, newsTagMeta } from '@/app/aktuelt/news-util'

import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BodyLong, BodyShort, Box, HStack, Heading, Tag, VStack } from '@navikt/ds-react'

import { sanitize } from '@/utils/news-html-util'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolved = await params
  const id = resolved.id
  const news = await getNewsById(id)
  if (!news) return notFound()
  return {
    title: news.title,
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  const id = resolved.id

  const news = await getNewsById(id)
  if (!news) return notFound()

  const title = news.title
  const sanitizedBody = sanitize(news.body)
  const published = formatPublishedDate(news.publishedFrom)
  return (
    <Box
      maxWidth={'700px'}
      marginInline={'auto'}
      paddingInline={'space-16'}
      paddingBlock={'space-16'}
      style={{ wordWrap: 'break-word' }}
    >
      <BackButton />
      <VStack gap={'space-32'} paddingBlock={'space-32'}>
        <article>
          <VStack gap={'space-4'}>
            <NewsArticleImage imageUrl={news.imageUrl} alt={news.title} />
            <Heading size={'large'} level={'1'} spacing>
              {title}
            </Heading>
            <BodyLong size="large">{news.description}</BodyLong>
            <HStack
              gap={'space-16'}
              align={'center'}
              paddingBlock={'space-16'}
              style={{ borderBottom: '1px solid var(--ax-border-neutral-subtle)' }}
            >
              {news.tags?.map((tag) => {
                const meta = newsTagMeta[tag]
                return (
                  <Tag key={tag} variant={'moderate'} data-color={meta?.tagColor ?? 'neutral'}>
                    {tag}
                  </Tag>
                )
              })}
              <BodyShort size={'medium'}>{`Publisert: ${published}`}</BodyShort>
            </HStack>
            <div id="aktuelt-article-body" dangerouslySetInnerHTML={{ __html: sanitizedBody }}></div>
          </VStack>
        </article>
      </VStack>
    </Box>
  )
}
