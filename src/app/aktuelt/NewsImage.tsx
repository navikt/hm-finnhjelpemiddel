'use client'

import { Box } from '@navikt/ds-react'
import { NewspaperIcon } from '@navikt/aksel-icons'
import Image, { StaticImageData } from 'next/image'
import { smallImageLoader, largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'
import defaultNyhetsbrev from './images/default-nyhetsbrev.svg'
import defaultNyhetsbrevLiten from './images/default-nyhetsbrev-liten.svg'
import defaultRammeavtale from './images/default-rammeavtale.svg'
import defaultRammeavtaleLiten from './images/default-rammeavtale-liten.svg'
import defaultFunksjonalitet from './images/default-funksjonalitet.svg'
import defaultFunksjonalitetLiten from './images/default-funksjonalitet-liten.svg'

type NewsImageProps = {
  imageUrl?: string
  tags?: string[]
  fontSize?: string
  alt?: string
  loaderSize?: 'small' | 'large'
  variant?: 'small' | 'large'
}

const loaders = {
  small: smallImageLoader,
  large: largeImageLoader,
}

const tagDefaultImages: Record<string, { large: StaticImageData; small: StaticImageData }> = {
  nyhetsbrev: { large: defaultNyhetsbrev, small: defaultNyhetsbrevLiten },
  rammeavtale: { large: defaultRammeavtale, small: defaultRammeavtaleLiten },
  funksjonalitet: { large: defaultFunksjonalitet, small: defaultFunksjonalitetLiten },
}

function getDefaultImage(tags?: string[], variant: 'small' | 'large' = 'large'): StaticImageData | null {
  if (!tags) return null
  for (const tag of tags) {
    const imgs = tagDefaultImages[tag.toLowerCase()]
    if (imgs) return imgs[variant]
  }
  return null
}

export default function NewsImage({ fontSize = '5rem', alt, imageUrl, tags, loaderSize = 'large', variant = 'large' }: NewsImageProps) {
    const [error, setError] = useState(false)

    if (imageUrl && !error) {
      console.log('NewsImage src:', loaders[loaderSize]({ src: imageUrl, width: 400, quality: 75 }))
      return (
          <Image loader={loaders[loaderSize]} src={imageUrl} alt={alt ?? ''} fill sizes={'(max-width: 768px) 100vw, '} style={{ objectFit: 'cover' }} onError={() => setError(true)} />
      )
    }

    const defaultImage = getDefaultImage(tags, variant)
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
