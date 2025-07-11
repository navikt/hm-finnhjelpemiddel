'use client'

import { ImageLoaderProps } from 'next/image'

enum Size {
  SMALL = '400',
  MEDIUM = '800',
  LARGE = '1600',
}

type ImageOptions = {
  src: string
  size: Size
}

const imageLoader = ({ src, size }: ImageOptions) =>
  src === '/assets/image-error.png' ? src : `${process.env.IMAGE_PROXY_URL}/${size}d/${src}`

export const smallImageLoader = ({ src }: ImageLoaderProps) => imageLoader({ src, size: Size.SMALL })
export const largeImageLoader = ({ src }: ImageLoaderProps) => imageLoader({ src, size: Size.LARGE })
