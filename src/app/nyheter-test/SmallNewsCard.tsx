import NewsImage from '@/app/nyheter-test/NewsImage'
import { Box, LinkCard, Tag } from '@navikt/ds-react'
import NextLink from 'next/link'
import { NewsDTO } from '@/app/nyheter-test/news-util'

type NewsProps = {
  news: NewsDTO
}

export default function SmallNewsCard({ news }: NewsProps) {
  return (
    <LinkCard key={news.id} size={'small'} style={{ minHeight: '160px', paddingInlineStart: '140px' }}>
      <Box style={{
        position:'absolute',
        overflow: 'hidden',
        borderTopLeftRadius: 'calc(var(--ax-radius-12) - 1px',
        borderBottomLeftRadius: 'calc(var(--ax-radius-12) - 1px)',
        left: 0,
        top: 0,
        bottom: 0,
        width: '130px',
      }}>
        <NewsImage imageUrl={news.image_url} tags={news.tags} fontSize={'5rem'} loaderSize={'small'}></NewsImage>
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
          <NextLink href={`/nyheter-test/${news.id}`}>{news.title}</NextLink>
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
        {news.tags?.map((tag) => (
          <Tag key={tag} size={'small'} variant={'moderate'} data-color={'neutral'}>
            {tag}
          </Tag>
        ))}
      </LinkCard.Footer>
    </LinkCard>
  )
}

