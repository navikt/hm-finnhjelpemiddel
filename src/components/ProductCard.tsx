import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BodyShort, Button, Heading } from '@navikt/ds-react'
import { Delete } from '@navikt/ds-icons'
import { ImageIcon } from '@navikt/aksel-icons'
import { smallImageLoader } from '../utils/image-util'
import { Product } from '../utils/product-util'

type ProductCardProps = {
  product: Product
  removeProduct: (product: Product) => void
}

const ProductCard = ({ product, removeProduct }: ProductCardProps) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  return (
    <motion.div className="product-card">
      <div className="product-card__image">
        <div className="image">
          {!hasImage && (
            <ImageIcon
              width="100%"
              height="100%"
              style={{ background: 'white' }}
              aria-label="Ingen bilde tilgjengelig"
            />
          )}
          {hasImage && (
            <Image
              loader={smallImageLoader}
              src={firstImageSrc}
              alt="Produktbilde"
              fill
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>
        <div className="overlay">
          <Button
            className="delete-button"
            onClick={() => removeProduct(product)}
            icon={<Delete title="Fjern produkt fra sammenligning" />}
          />
        </div>
      </div>
      <div className="info">
        <Heading size="xsmall" className="product-card__product-title">
          {product.title}
        </Heading>
        <div className="hms-nr">
          <BodyShort size="small">HMS-nr.</BodyShort>
          <BodyShort size="small">{product.hmsArtNr ? product.hmsArtNr : '–'}</BodyShort>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
