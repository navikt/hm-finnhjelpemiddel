'use client'

import { Bleed, Box } from '@navikt/ds-react'
import Image, { StaticImageData } from 'next/image'
import { largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'
import defaultNyhetsbrev from '../images/default-nyhetsbrev.svg'
import defaultRammeavtale from '../images/default-rammeavtale.svg'

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

export default function NewsArticleImage({ imageUrl, alt, tags }: { imageUrl?: string; alt: string; tags?: string[] }) {
  const [error, setError] = useState(false)

  const defaultImage = getDefaultImage(tags)
  const showDefault = (!imageUrl || error) && defaultImage

  if (!imageUrl && !defaultImage) return null
  if (error && !defaultImage) return null

  return (
    <Bleed marginInline={"space-64"}>
      <Box
        style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}
        borderRadius={'12'}
      >
        {showDefault ? (
          <Image src={defaultImage!} alt={alt} fill style={{ objectFit: 'cover' }} />
        ) : (
          <Image loader={largeImageLoader} src={imageUrl!} alt={alt} fill style={{ objectFit: 'cover' }} onError={() => setError(true)} />
        )}
      </Box>
    </Bleed>
  )
}
