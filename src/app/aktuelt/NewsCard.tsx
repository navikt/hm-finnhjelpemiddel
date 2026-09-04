import NewsImage from '@/app/aktuelt/NewsImage'
import { NewsDTO, formatPublishedDate, newsTagMeta } from '@/app/aktuelt/news-util'

import NextLink from 'next/link'

import { BodyShort, Box, LinkCard, Tag } from '@navikt/ds-react'

type NewsProps = {
  news: NewsDTO
  searchQuery?: string
}

export default function NewsCard({ news, searchQuery }: NewsProps) {
  const date = formatPublishedDate(news.publishedFrom)

  const firstTag = news.tags[0]
  const tagMetaData = newsTagMeta[firstTag]

  return (
    <LinkCard>
      <LinkCard.Image aspectRatio="16/9">
        {news.imageUrl ? (
          <NewsImage imageUrl={news.imageUrl} alt={news.imageDescription} loaderSize={'small'} tags={news.tags} />
        ) : (
          <Box
            height={'100%'}
            style={{
              backgroundColor: tagMetaData.defaultBackgroundColor,
              fontSize: '90px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {tagMetaData.defaultIcon}
          </Box>
        )}
      </LinkCard.Image>
      <LinkCard.Title style={{ textWrap: 'balance', fontWeight: 'initial' }}>
        <LinkCard.Anchor asChild>
          <NextLink
            href={`/aktuelt/${news.id}${searchQuery ? `?${searchQuery}` : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {news.title}
          </NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description>
        <BodyShort size={'medium'} style={{ color: 'var(--ax-text-neutral-decoration)' }}>
          {date}
        </BodyShort>
      </LinkCard.Description>
      <LinkCard.Footer>
        {news.tags?.map((tag) => {
          const meta = newsTagMeta[tag]
          return (
            <Tag key={tag} size={'small'} variant={'moderate'} data-color={meta?.tagColor ?? 'neutral'}>
              {meta.tagText}
            </Tag>
          )
        })}
      </LinkCard.Footer>
    </LinkCard>
  )
}
