import { LinkCard, Tag, Box } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import Image from 'next/image'
import { NewspaperIcon } from '@navikt/aksel-icons'
import NextLink from 'next/link'
import NewsImage from '@/app/nyheter-test/NewsImage'

type NewsProps = {
  news: NewsDTO
}

export default function NewsCard({ news }: NewsProps){

  return (
      <LinkCard key={news.id} style={{minHeight: "490px"}}>
        <LinkCard.Image aspectRatio="16/9">
          {/*<Image fill src="/assets/supreme_glorious_leader.png" alt="Alt-tekst for bilde"/> */}
          <NewsImage fontSize={"5rem"}></NewsImage>
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
          <Box paddingBlock={'space-0 space-16'}>
          <Tag size="small" variant="info-moderate">
            Ny rammeavtale
          </Tag>
       </Box>
        </LinkCard.Footer>
      </LinkCard>
  )
}
