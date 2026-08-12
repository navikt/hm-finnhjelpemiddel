'use client'

import { useState } from 'react'

import Image from 'next/image'

import { largeImageLoader, smallImageLoader } from '@/utils/image-util'

type NewsImageProps = {
  imageUrl?: string
  alt?: string
  loaderSize?: 'small' | 'large'
  tags?: string[]
}

const loaders = {
  small: smallImageLoader,
  large: largeImageLoader,
}

export default function NewsImage({ alt, imageUrl, loaderSize = 'large', tags }: NewsImageProps) {
  const [error, setError] = useState(false)

  if (imageUrl && !error) {
    return (
      <Image
        loader={loaders[loaderSize]}
        src={imageUrl}
        alt={alt ?? ''}
        fill
        sizes="(max-width: 768px) 100vw"
        style={{ objectFit: 'cover' }}
        onError={() => setError(true)}
      />
    )
  }

  return <></>
}
