'use client'

import Image from 'next/image'
import { smallImageLoader, largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'
import defaultBilde from './images/default-bilde.svg'

type NewsImageProps = {
  imageUrl?: string
  alt?: string
  loaderSize?: 'small' | 'large'
}

const loaders = {
  small: smallImageLoader,
  large: largeImageLoader,
}

export default function NewsImage({ alt, imageUrl, loaderSize = 'large' }: NewsImageProps) {
  const [error, setError] = useState(false)

  if (imageUrl && !error) {
    return (
      <Image loader={loaders[loaderSize]} src={imageUrl} alt={alt ?? ''} fill sizes="(max-width: 768px) 100vw" style={{ objectFit: 'cover' }} onError={() => setError(true)} />
    )
  }

  return (
    <Image src={defaultBilde} alt={alt ?? ''} fill style={{ objectFit: 'cover' }} unoptimized />
  )
}
