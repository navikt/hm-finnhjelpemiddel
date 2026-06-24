import { BodyLong, Heading, HStack, LinkCard, Tag, VStack } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'

type NewsProps = {
  news: NewsDTO
}

export default function NewsCard({ news }: NewsProps){


  return (
    <LinkCard key={news.id} style={{ height: '100%', minHeight: '180px' }}>
      <LinkCard.Image aspectRatio="16/6">
        <img src="/images/og/blogg/image-2.png" alt="Alt-tekst for bilde" width="700" />
      </LinkCard.Image>
      <LinkCard.Title>{news.title}</LinkCard.Title>
      <LinkCard.Description>
        {news.description}
      </LinkCard.Description>
      <LinkCard.Footer>
        <Tag size="small" variant="strong">
          Tag 1
        </Tag>
        <Tag size="small">Tag 2</Tag>
      </LinkCard.Footer>
    </LinkCard>
  )
}
