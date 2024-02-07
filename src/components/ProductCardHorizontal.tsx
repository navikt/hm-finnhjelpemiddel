'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { BodyLong, Heading } from '@navikt/ds-react'

import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'

import '../styles/product-card-horizontal.scss'

import AgreementIcon from './AgreementIcon'

interface CardProps {
  product: Product
}

const ProductCardHorizontal = ({ product }: CardProps) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const [imageLoadingError, setImageLoadingError] = useState(false)

  return (
    <Link
      className="product-card-horizontal__link-content"
      href={`/produkt/${product.id}`}
      aria-label={`Gå til ${product.title}`}
    >
      {product.agreements?.length && <AgreementIcon rank={99} />}
      <div className="product-card-horizontal__image-container">
        {hasImage && !imageLoadingError ? (
          <Image
            loader={smallImageLoader}
            src={firstImageSrc}
            onError={() => {
              setImageLoadingError(true)
            }}
            alt="Produktbilde"
            fill
            sizes="50vw"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <Image
            src={'/assets/image-error.png'}
            alt="Produktbilde mangler"
            fill
            sizes="50vw"
            priority
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>
      <div className="product-card-horizontal__info-container">
        <Heading className="product-card-horizontal__heading" size="xsmall">
          {product.title}
        </Heading>
        <BodyLong size="small" className="product-card-horizontal__product-description">
          {product.attributes.text}
        </BodyLong>
      </div>
    </Link>
  )
}

export default ProductCardHorizontal
