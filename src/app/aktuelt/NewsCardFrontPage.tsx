'use client'

import { NewsDTO, formatPublishedDate, getTagConfig } from '@/app/aktuelt/news-util'

import Image from 'next/image'
import NextLink from 'next/link'

import { BodyShort, Box, LinkCard, Tag } from '@navikt/ds-react'

import { smallImageLoader } from '@/utils/image-util'

import styles from './NewsCardFrontPage.module.scss'

export const NewsCardFrontPage = ({ news, big }: { news: NewsDTO; big: boolean }) => {
  const date = formatPublishedDate(news.publishedFrom)
  const firstTag = news.tags[0]
  const tagMetaData = getTagConfig(firstTag)

  return (
    <LinkCard key={news.id} size={big ? 'medium' : 'small'} className={styles.container}>
      <LinkCard.Image className={styles.imageContainer}>
        {news.imageUrl ? (
          <Image
            width={100}
            height={500}
            loader={smallImageLoader}
            src={news.imageUrl}
            alt={'Bilde for nyhet ' + news.title}
            aria-hidden={true}
            draggable={false}
            className={styles.iconImage}
          />
        ) : (
          <Box className={styles.imageBox} style={{ backgroundColor: tagMetaData.defaultBackgroundColor }}>
            {tagMetaData.defaultIcon}
          </Box>
        )}
      </LinkCard.Image>
      <LinkCard.Title style={{ textWrap: 'balance', fontWeight: 'initial' }}>
        <LinkCard.Anchor asChild>
          <NextLink href={`/aktuelt/${news.id}`} className={styles.linkText}>
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
