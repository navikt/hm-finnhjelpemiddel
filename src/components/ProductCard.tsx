import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { motion } from 'framer-motion'

import { MultiplyIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, Heading } from '@navikt/ds-react'

import { smallImageLoader } from '../utils/image-util'
import { Product } from '../utils/product-util'

type ProductCardProps = {
  product: Product
  removeProduct: (product: Product) => void
}

const ProductCard = ({ product, removeProduct }: ProductCardProps) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  const [imageLoadingError, setImageLoadingError] = useState(false)

  return (
    <div className="product-card">
      <Button
        className="remove-button"
        onClick={() => removeProduct(product)}
        icon={<MultiplyIcon title="Fjern produkt fra sammenligning" />}
      />
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
        <Link className="product-card__link" href={`/produkt/${product.id}`} aria-label="Gå til produktet">
          <Heading size="xsmall" className="product-card__product-title">
            {product.title}
          </Heading>
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
