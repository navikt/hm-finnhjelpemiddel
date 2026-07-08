import { BodyLong, Box, Heading, HStack, Tag, VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import { getNewsById } from '@/app/aktuelt/news-util'
import { notFound } from 'next/navigation'
import { sanitize } from '@/utils/news-html-util'
import NewsArticleImage from '@/app/aktuelt/[id]/NewsArticleImage'
import BackButton from '@/app/aktuelt/[id]/BackButton'


export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolved = await params
  const id = resolved.id
  const news = await getNewsById(id)
  if (!news) return notFound()
  const plain = news.body
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    title: news.title,
    description: plain.slice(0, 160),
  }
}

export default async function NewsArticlePage({
  params,
                                              }: {
  params: Promise<{id: string}>
}) {
  const resolved = await params
  const id = resolved.id

  const news = await getNewsById(id)
  if(!news) return notFound()

  const title = news.title
  const sanitizedBody = sanitize(news.body)
  const published = new Date(news.created).toLocaleDateString('nb-NO')
  const isUpdated = news.updated && news.updated !== news.created
  const updated = isUpdated ? new Date(news.updated).toLocaleDateString('nb-NO') : null
  return (
    <Box maxWidth={'700px'} marginInline={'auto'} paddingInline={'space-16'} paddingBlock={'space-16'} style={{ wordWrap: 'break-word' }}
    >
        <BackButton />
        <VStack gap={'space-32'} paddingBlock={'space-32'}>
          <article>
            <VStack gap={'space-4'}>
              <NewsArticleImage imageUrl={news.image_url} alt={news.title} />
              <Heading size={'large'} level={'1'}>
                {title}
              </Heading>
              <HStack gap={'space-16'} align={'center'}>
                <time>{updated ? `Oppdatert: ${updated}` : `Publisert: ${published}`}</time>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: 'normal', flexWrap: 'wrap' }}>
                  {news.tags?.map((tag) => (
                    <li key={tag}>
                      <Tag variant={'moderate'} data-color={'neutral'}>
                        {tag}
                      </Tag>
                    </li>
                  ))}
                </ul>
              </HStack>
              <BodyLong size="medium" weight="semibold">
                {news.description}
              </BodyLong>
              <div dangerouslySetInnerHTML={{ __html: sanitizedBody }}></div>
            </VStack>
          </article>
        </VStack>
    </Box>
  )
}
