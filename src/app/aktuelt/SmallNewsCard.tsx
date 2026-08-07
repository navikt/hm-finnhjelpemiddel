import NewsImage from '@/app/aktuelt/NewsImage'
import { NewsDTO, NewsTag, formatPublishedDate, newsTagMeta } from '@/app/aktuelt/news-util'

import NextLink from 'next/link'

import { DocPencilIcon, LightBulbIcon, NewsletterIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, HStack, LinkCard, Tag } from '@navikt/ds-react'

type NewsProps = {
  news: NewsDTO
}

export default function SmallNewsCard({ news }: NewsProps) {
  const date = formatPublishedDate(news.publishedFrom)
  const firstTag = news.tags[0]
  const tagMetaData = newsTagMeta[firstTag]

  console.log(firstTag, NewsTag.NY_FUNKSJON)
  if (firstTag === NewsTag.NY_FUNKSJON) {
    console.log('aaa, ')
  }
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
          }}
          borderRadius={'12 0 0 12'}
        >
          {firstTag === NewsTag.RAMMEAVTALE && (
            <DocPencilIcon fontSize={'63px'} color={'var(--ax-bg-brand-magenta-moderate-pressed)'} />
          )}
          {firstTag === NewsTag.NYHETSBREV && (
            <NewsletterIcon fontSize={'63px'} color={'var(--ax-bg-accent-moderate-pressed)'} />
          )}
          {firstTag === NewsTag.NY_FUNKSJON && (
            <LightBulbIcon fontSize={'63px'} color={'var(--ax-bg-warning-moderate-hover)'} />
          )}
        </Box>
      )}

      <LinkCard.Title style={{ textWrap: 'balance' }}>
        <LinkCard.Anchor asChild>
          <NextLink href={`/aktuelt/${news.id}`}>{news.title}</NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Footer>
        <HStack justify={'space-between'} width={'100%'}>
          {news.tags?.map((tag) => {
            const meta = newsTagMeta[tag]
            return (
              <Tag key={tag} size={'small'} variant={'moderate'} data-color={meta?.tagColor ?? 'neutral'}>
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
