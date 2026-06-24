import { LinkCard, Tag, Box } from '@navikt/ds-react'
import { NewsDTO } from '@/app/nyheter-test/news-util'
import Image from 'next/image'

type NewsProps = {
  news: NewsDTO
}

export default function NewsCard({ news }: NewsProps){

  return (
    <Box height={"27rem"}>
      <LinkCard key={news.id} style={{ height: '100%', minHeight: '300px' }}>
        <LinkCard.Image aspectRatio="16/9">
          <Image fill src="/assets/supreme_glorious_leader.png" alt="Alt-tekst for bilde" />
        </LinkCard.Image>
        <LinkCard.Title>{news.title}</LinkCard.Title>
        <LinkCard.Description>{news.description}</LinkCard.Description>
        <LinkCard.Footer>
          <Tag size="small" variant="strong">
            Tag 1
          </Tag>
          <Tag size="small">Tag 2</Tag>
        </LinkCard.Footer>
      </LinkCard>
    </Box>
  )
}
