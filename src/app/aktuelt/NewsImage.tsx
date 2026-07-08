'use client'

import { Box } from '@navikt/ds-react'
import { NewspaperIcon } from '@navikt/aksel-icons'
import Image, { StaticImageData } from 'next/image'
import { smallImageLoader, largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'
import defaultNyhetsbrev from './images/default-nyhetsbrev.svg'
import defaultRammeavtale from './images/default-rammeavtale.svg'

type NewsImageProps = {
  imageUrl?: string
  tags?: string[]
  fontSize?: string
  alt?: string
  loaderSize?: 'small' | 'large'
}

const loaders = {
  small: smallImageLoader,
  large: largeImageLoader,
}

const tagDefaultImages: Record<string, StaticImageData> = {
  nyhetsbrev: defaultNyhetsbrev,
  rammeavtale: defaultRammeavtale,
}

function getDefaultImage(tags?: string[]): StaticImageData | null {
  if (!tags) return null
  for (const tag of tags) {
    const img = tagDefaultImages[tag.toLowerCase()]
    if (img) return img
  }
  return null
}

export default function NewsImage({ fontSize = '5rem', alt, imageUrl, tags, loaderSize = 'large' }: NewsImageProps) {
    const [error, setError] = useState(false)

    if (imageUrl && !error) {
      return (
          <Image loader={loaders[loaderSize]} src={imageUrl} alt={alt ?? ''} fill sizes={'(max-width: 768px) 100vw, '} style={{ objectFit: 'cover' }} onError={() => setError(true)} />
      )
    }

    const defaultImage = getDefaultImage(tags)
    if (defaultImage) {
      return (
        <Image src={defaultImage} alt={alt ?? ''} fill style={{ objectFit: 'cover' }} unoptimized/>
      )
    }

    return (
    <Box style={{
      backgroundColor: 'var(--ax-bg-neutral-soft)',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <NewspaperIcon fontSize={fontSize} aria-hidden opacity={"5%"}/>
    </Box>
    )
}
