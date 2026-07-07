'use client'

import { Box } from '@navikt/ds-react'
import { NewspaperIcon } from '@navikt/aksel-icons'
import Image from 'next/image'
import { smallImageLoader, largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'

type NewsImageProps = {
  imageUrl?: string
  fontSize?: string
  alt?: string
  loaderSize?: 'small' | 'large'
}

const loaders = {
  small: smallImageLoader,
  large: largeImageLoader,
}

export default function NewsImage({fontSize= '5rem', alt, imageUrl, loaderSize = 'large'}: NewsImageProps) {
    const [error, setError] = useState(false)

    if(imageUrl && !error) {
      return (
          <Image loader={loaders[loaderSize]} src={imageUrl} alt={alt ?? ''} fill sizes={'(max-width: 768px) 100vw, '} style={{ objectFit: 'cover' }} onError={() => setError(true)} />
      )
    }

    return(
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
