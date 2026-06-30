'use client'

import { Box } from '@navikt/ds-react'
import { NewspaperIcon } from '@navikt/aksel-icons'
import Image from 'next/image'
import { largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'

type NewsImageProps = {
  imageUrl?: string
  fontSize?: string
  alt?: string
}

export default function NewsImage({fontSize= '5rem', alt, imageUrl}: NewsImageProps) {
    const [error, setError] = useState(false)

    if(imageUrl && !error) {
      return (
        <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image loader={largeImageLoader} src={imageUrl} alt={alt ?? ''} fill style={{ objectFit: 'cover' }} onError={() => setError(true)} />
        </Box>
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
