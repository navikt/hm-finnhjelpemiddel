'use client'

import React, { useState } from 'react'

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
    <div className="product-card-horizontal__card-container">
      <div className="product-card-horizontal__first-column">
        {product.applicableAgreementInfo && <AgreementIcon rank={99} />}
      </div>
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
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <Image
            src={'/assets/image-error.png'}
            alt="Produktbilde mangler"
            fill
            priority
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>
      <div className="product-card-horizontal__info-container">
        <Link className="product-card__link" href={`/produkt/${product.id}`} aria-label="Gå til produktet">
          <Heading className="product-card-horizontal__heading" size="xsmall">
            {product.title}
          </Heading>
        </Link>
        <BodyLong className="product-card-horizontal__product-description">{product.attributes.text}</BodyLong>
      </div>
    </div>
  )
}

export default ProductCardHorizontal
