import NewsImage from '@/app/aktuelt/NewsImage'
import { BodyShort, Box, HStack, LinkCard, Tag } from '@navikt/ds-react'
import NextLink from 'next/link'
import { NewsDTO, formatPublishedDate, newsTagMeta } from '@/app/aktuelt/news-util'
import { DocPencilIcon } from '@navikt/aksel-icons'

type NewsProps = {
  news: NewsDTO
}

export default function SmallNewsCard({ news }: NewsProps) {
  const date = formatPublishedDate(news.publishedFrom)

  return (
    <LinkCard key={news.id} size={'small'} style={{ minHeight: '160px', paddingInlineStart: '140px' }}>
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
        <NewsImage imageUrl={news.imageUrl} tags={news.tags} fontSize={'5rem'} loaderSize={'small'} variant={'small'}></NewsImage>
      </Box>
      <LinkCard.Title
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        <LinkCard.Anchor asChild>
          <NextLink href={`/aktuelt/${news.id}`}>{news.title}</NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {news.description}
      </LinkCard.Description>
      <LinkCard.Footer>
        <HStack justify={'space-between'} width={'100%'}>
          {news.tags?.map((tag) => {
            const meta = newsTagMeta[tag.toLowerCase() as keyof typeof newsTagMeta]
            const Icon = meta?.icon ?? DocPencilIcon
            return (
              <Tag key={tag} size={'small'} variant={'moderate'} data-color={meta?.color ?? 'neutral'}>
                <Icon aria-hidden />
                {tag}
              </Tag>
            )
          })}
          <BodyShort size={'medium'} style={{ color: 'var(--ax-text-neutral-decoration)' }}>
            {date}
          </BodyShort>
        </HStack>
      </LinkCard.Footer>
    </LinkCard>
  )
}

