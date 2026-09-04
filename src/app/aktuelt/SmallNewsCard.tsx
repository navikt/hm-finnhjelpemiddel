import NewsImage from '@/app/aktuelt/NewsImage'
import { NewsDTO, formatPublishedDate, getTagConfig } from '@/app/aktuelt/news-util'

import NextLink from 'next/link'

import { BodyShort, Box, LinkCard, Tag } from '@navikt/ds-react'

type NewsProps = {
  news: NewsDTO
}

export default function SmallNewsCard({ news }: NewsProps) {
  const date = formatPublishedDate(news.publishedFrom)
  const firstTag = news.tags[0]
  const tagMetaData = getTagConfig(firstTag)

  return (
    <LinkCard key={news.id} size={'small'} style={{ minHeight: '130px', paddingInlineStart: '140px' }}>
      {news.imageUrl ? (
        <Box
          style={{
            position: 'absolute',
            overflow: 'hidden',
            borderTopLeftRadius: 'calc(var(--ax-radius-12) - 1px)',
            borderBottomLeftRadius: 'calc(var(--ax-radius-12) - 1px)',
            left: 0,
            top: 0,
            bottom: 0,
            width: '130px',
          }}
        >
          <NewsImage imageUrl={news.imageUrl} loaderSize={'small'} tags={news.tags} />
        </Box>
      ) : (
        <Box
          width={'130px'}
          height={'100%'}
          style={{
            position: 'absolute',
            backgroundColor: tagMetaData.defaultBackgroundColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '63px',
          }}
          borderRadius={'12 0 0 12'}
        >
          {tagMetaData.defaultIcon}
        </Box>
      )}

      <LinkCard.Title style={{ textWrap: 'balance', fontWeight: 'initial' }}>
        <LinkCard.Anchor asChild>
          <NextLink href={`/aktuelt/${news.id}`} style={{ textDecoration: 'none' }}>
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
        <Tag key={firstTag} size={'small'} variant={'moderate'} data-color={tagMetaData?.tagColor ?? 'neutral'}>
          {tagMetaData.tagText}
        </Tag>
      </LinkCard.Footer>
    </LinkCard>
  )
}
