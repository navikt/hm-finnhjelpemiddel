import { LinkCard, Tag, HStack, BodyShort } from '@navikt/ds-react'
import { NewsDTO, formatPublishedDate, newsTagMeta } from '@/app/aktuelt/news-util'
import NextLink from 'next/link'
import NewsImage from '@/app/aktuelt/NewsImage'
import { DocPencilIcon } from '@navikt/aksel-icons'

type NewsProps = {
  news: NewsDTO
  searchQuery?: string
}

export default function NewsCard({ news, searchQuery }: NewsProps){
  const date = formatPublishedDate(news.publishedFrom)

  return (
    <LinkCard style={{ minHeight: '490px' }}>
      <LinkCard.Image aspectRatio="16/9">
        <NewsImage
          imageUrl={news.imageUrl}
          alt={news.imageDescription}
          loaderSize={'large'}
        />
      </LinkCard.Image>
      <LinkCard.Title>
        <LinkCard.Anchor asChild>
          <NextLink href={`/aktuelt/${news.id}${searchQuery ? `?${searchQuery}` : ''}`}>{news.title}</NextLink>
        </LinkCard.Anchor>
      </LinkCard.Title>
      <LinkCard.Description
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 5,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {news.description}
      </LinkCard.Description>
      <LinkCard.Footer>
        <HStack gap={'space-4'} wrap justify={'space-between'} width={'100%'}>
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
            {`Publisert: ${date}`}
          </BodyShort>
        </HStack>
      </LinkCard.Footer>
    </LinkCard>
  )
}
