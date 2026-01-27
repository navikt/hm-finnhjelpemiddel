'use client'

import { Video } from '@/utils/product-util'
import { BodyShort, VStack } from '@navikt/ds-react'
import Link from 'next/link'
import styles from './Videos.module.scss'
import ReactPlayer from 'react-player'

export const Videos = ({ videos }: { videos: Video[] }) => {
  if (!videos.length) {
    return <BodyShort>Ingen videolenker er lagt til av leverandør på dette hjelpemiddelet.</BodyShort>
  }
  return (
    <VStack as="ul" gap={"space-32"} className={styles.videoList}>
      {videos.map((video, index) => (
        <VStack as="li" key={index} gap="space-16">
          <Link target="_blank" title={video.uri} href={video.uri}>
            {video.text || video.uri}
          </Link>
          <ReactPlayer className={styles.player} src={video.uri} controls={true} width="100%" height="100%" />
        </VStack>
      ))}
    </VStack>
  );
}
