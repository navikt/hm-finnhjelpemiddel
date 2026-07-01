import { LinkCard, Tag, HStack } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import NextLink from 'next/link'
import NewsImage from '@/app/nyheter-test/NewsImage'

type NewsProps = {
  news: NewsDTO
}

export default function NewsCard({ news }: NewsProps){

  return (
      <LinkCard key={news.id} style={{minHeight: "490px"}}>
        <LinkCard.Image aspectRatio="16/9">
          <NewsImage fontSize={"5rem"} imageUrl={news.image_url}></NewsImage>
        </LinkCard.Image>
        <LinkCard.Title>
          <LinkCard.Anchor asChild>
            <NextLink href={`/nyheter-test/${news.id}`}>
              {news.title}
            </NextLink>
          </LinkCard.Anchor>
        </LinkCard.Title>
        <LinkCard.Description style={{
          display: '-webkit-box',
          WebkitLineClamp: 5,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>{news.description}</LinkCard.Description>
        <LinkCard.Footer>
          <HStack gap={"space-4"} wrap>
            {news.tags?.map((tag) => (
              <Tag key={tag} size={'small'} variant={"moderate"} data-color={"neutral"}>
                {tag}
              </Tag>
            ))}
          </HStack>
        </LinkCard.Footer>
      </LinkCard>
  )
}
