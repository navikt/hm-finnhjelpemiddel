'use client'
import dynamic from 'next/dynamic'
import { Video } from '@/utils/product-util'
import { BodyShort, VStack } from '@navikt/ds-react'
import Link from 'next/link'
import styles from './Videos.module.scss'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })

export const Videos = ({ videos }: { videos: Video[] }) => {
  if (!videos.length) {
    return <BodyShort>Ingen videolenker er lagt til av leverandør på dette hjelpemiddelet.</BodyShort>
  }
  return (
    <VStack as="ul" gap={'8'} className={styles.videoList}>
      {videos.map((video, index) => (
        <VStack as="li" key={index} gap="4">
          <Link target="_blank" title={video.uri} href={video.uri}>
            {video.text || video.uri}
          </Link>
          <div className={styles.playerWrapper}>
            <ReactPlayer className={styles.reactPlayer} url={video.uri} controls={true} width="100%" height="100%" />
          </div>
        </VStack>
      ))}
    </VStack>
  )
}
