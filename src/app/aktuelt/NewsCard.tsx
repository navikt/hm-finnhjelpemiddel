import { LinkCard, Tag, HStack, BodyShort } from '@navikt/ds-react'
import { NewsDTO, formatPublishedDate } from '@/app/aktuelt/news-util'
import NextLink from 'next/link'
import NewsImage from '@/app/aktuelt/NewsImage'

type NewsProps = {
  news: NewsDTO
  searchQuery?: string
}

export default function NewsCard({ news, searchQuery }: NewsProps){
  const date = formatPublishedDate(news.publishedFrom)

  return (
    <LinkCard key={news.id} style={{ minHeight: '490px' }}>
      <LinkCard.Image aspectRatio="16/9">
        <NewsImage
          fontSize={'5rem'}
          imageUrl={news.imageUrl}
          alt={news.imageDescription}
          tags={news.tags}
          loaderSize={'large'}
        ></NewsImage>
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
          {news.tags?.map((tag) => (
            <Tag key={tag} size={'small'} variant={'moderate'} data-color={'neutral'}>
              {tag}
            </Tag>
          ))}
          <BodyShort size={'medium'} style={{ color: 'var(--ax-text-neutral-decoration)' }}>
            {`Publisert: ${date}`}
          </BodyShort>
        </HStack>
      </LinkCard.Footer>
    </LinkCard>
  )
}
