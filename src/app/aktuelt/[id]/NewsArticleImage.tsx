'use client'

import { Bleed, Box } from '@navikt/ds-react'
import Image from 'next/image'
import { largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'

export default function NewsArticleImage({ imageUrl, alt }: { imageUrl?: string; alt: string }) {
  const [error, setError] = useState(false)

  if (!imageUrl || error) return null

  return (
    <Bleed marginInline={{ md: 'space-64'}}>
      <Box
        style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}
        borderRadius={'12'}
      >
        <Image loader={largeImageLoader} src={imageUrl} alt={alt} fill style={{ objectFit: 'cover' }} onError={() => setError(true)} />
      </Box>
    </Bleed>
  )
}
