'use client'

import Image from 'next/image'
import { smallImageLoader, largeImageLoader } from '@/utils/image-util'
import { useState } from 'react'
import { newsTagMeta, NewsTag } from '@/app/aktuelt/news-util'

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

export default function NewsImage({ alt, imageUrl, loaderSize = 'large', tags}: NewsImageProps) {
  const [error, setError] = useState(false)

  if (imageUrl && !error) {
    return (
      <Image loader={loaders[loaderSize]} src={imageUrl} alt={alt ?? ''} fill sizes="(max-width: 768px) 100vw" style={{ objectFit: 'cover' }} onError={() => setError(true)} />
    )
  }

  const tag = tags?.[0]?.toLowerCase() as NewsTag | undefined
  const tagImage = tag && newsTagMeta[tag]?.image

  if (!tagImage) return null

  return <Image src={tagImage} alt={alt ?? ''} fill style={{ objectFit: 'cover' }} unoptimized />
}
