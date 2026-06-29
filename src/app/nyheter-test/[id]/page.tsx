import { Bleed, BodyLong, Box, Button, Heading, Page, Tag, VStack } from '@navikt/ds-react'
import { Metadata } from 'next'
import { getNewsById } from '@/app/nyheter-test/news-util'
import { notFound } from 'next/navigation'
import { sanitize } from '@/utils/news-html-util'
import { ArrowLeftIcon } from '@navikt/aksel-icons'
import NewsImage from '@/app/nyheter-test/NewsImage'


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
  const publised = new Date(news.created).toLocaleDateString('nb-NO')
  const updated = news.updated ? new Date(news.updated).toLocaleDateString('nb-NO') : null
  return (
    <Box maxWidth={'700px'} marginInline={'auto'} paddingInline={'space-16'}>
      <VStack gap={'space-32'} paddingBlock={'space-32'}>
        <article>
          <VStack gap={'space-16'}>
            {news.imageUrl && (
              <Bleed marginInline={"space-64"}>
                <Box
                  style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden'}}
                  borderRadius={'12'}
                >
                  <NewsImage imageUrl={news.imageUrl} alt={news.title} fontSize="5rem" />
                </Box>
              </Bleed>
            )}
            <Heading size={'large'} level={'1'}>
              {title}
            </Heading>
            <time>{updated ? `Oppdatert: ${updated}` : `Publisert: ${publised}`}</time>
            <BodyLong size="large">{news.description}</BodyLong>
            <div dangerouslySetInnerHTML={{ __html: sanitizedBody }}></div>

            <footer>
              <ul style={{listStyle: 'none', padding: 0, display: 'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                {news.tags?.map((tag) => (
                  <li key={tag}>
                    <Tag variant={"moderate"} data-color={'neutral'}>
                      {tag}
                    </Tag>
                  </li>
                ))}
              </ul>
            </footer>
          </VStack>
        </article>
      </VStack>
    </Box>
  )
}
