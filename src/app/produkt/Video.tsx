'use client'
import dynamic from "next/dynamic";
const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });
import { Video } from '@/utils/product-util'
import { BodyShort, HStack, VStack } from '@navikt/ds-react'
import Link from 'next/link'

export const Videos = ({ videos }: { videos: Video[] }) => {
  if (!videos.length) {
    return <BodyShort>Ingen videolenker er lagt til av leverandør på dette hjelpemiddelet.</BodyShort>
  }
  return (
    <HStack as="ul" gap="8" className="video-list">
      {videos.map((video, index) => (
        <VStack as="li" key={index} gap="4">
          <Link target="_blank" title={video.uri} href={video.uri}>
            {video.text || video.uri}
          </Link>
          <ReactPlayer url={video.uri} controls={true} width="100%" height="100%" />
        </VStack>
      ))}
    </HStack>
  )
}
