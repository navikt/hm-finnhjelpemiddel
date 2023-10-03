'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { MultiplyIcon } from '@navikt/aksel-icons'
import { Button, Heading } from '@navikt/ds-react'

import { smallImageLoader } from '../utils/image-util'
import { Product } from '../utils/product-util'

import AgreementIcon from './AgreementIcon'

type ProductCardProps = {
  product: Product
  removeProduct?: (product: Product) => void
  showRank?: boolean
}

const ProductCard = ({ product, removeProduct, showRank }: ProductCardProps) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const [imageLoadingError, setImageLoadingError] = useState(false)

  return (
    <div className={removeProduct ? 'product-card border' : 'product-card'}>
      {removeProduct && (
        <Button
          variant="tertiary-neutral"
          className="remove-button"
          onClick={() => removeProduct(product)}
          icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
        />
      )}
      <Link
        className="product-card__link-content"
        href={`/produkt/${product.id}`}
        aria-label={`Gå til ${product.title}`}
      >
        <div className="product-card__image">
          <div className="image">
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
                alt="Produktbilde"
                fill
                style={{ padding: '10px' }}
                sizes="50vw"
                priority
              />
            )}
          </div>
        </div>
        <div className="info">
          <Heading size="xsmall" className="text-line-clamp">
            {product.title}
          </Heading>
        </div>
        {showRank && product.applicableAgreementInfo && <AgreementIcon rank={product.applicableAgreementInfo.rank} />}
      </Link>
    </div>
  )
}

export default ProductCard
