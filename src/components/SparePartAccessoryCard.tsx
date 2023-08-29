'use client'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import styled from 'styled-components'

import { CheckmarkIcon } from '@navikt/aksel-icons'
import { BodyLong, Heading } from '@navikt/ds-react'

import { smallImageLoader } from '@/utils/image-util'
import { Product } from '@/utils/product-util'

interface CardProps {
  product: Product
}

const SparePartAccessoryCard = ({ product }: CardProps) => {
  const hasImage = product.photos.length !== 0
  const [firstImageSrc] = useState(product.photos.at(0)?.uri || '')

  // const address = 'https://finnhjelpemidler.intern.dev.nav.no/imageproxy/400d/orig/54382.jpg'

  const [imageLoadingError, setImageLoadingError] = useState(false)

  return (
    <CardContainer>
      <FirstColumn>
        {product.applicableAgreementInfo && (
          <span className="icon-wrapper icon-wrapper--green">
            <CheckmarkIcon title="a11y-title" fontSize="1.5rem" />
          </span>
        )}
      </FirstColumn>
      <ImageContainer>
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
      </ImageContainer>
      <InfoContainer>
        <Link className="product-card__link" href={`/produkt/${product.id}`} aria-label="Gå til produktet">
          <Heading size="xsmall">{product.title}</Heading>
        </Link>
        <StyledBodyLong>{product.isoCategoryText}</StyledBodyLong>
      </InfoContainer>
    </CardContainer>
  )
}

export default SparePartAccessoryCard

const CardContainer = styled.div`
  max-width: 25rem;
  height: 10rem;
  display: grid;
  grid-template-columns: 0.3fr 0.5fr 1fr;
  grid-column-gap: var(--a-spacing-2);
  border-radius: var(--a-border-radius-medium);
  padding: var(--a-spacing-4);
  box-shadow: 0 1px 2px -1px rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  background: white;
`

const FirstColumn = styled.div`
  display: flex;
  justify-content: center;
  grid-column-start: 1;
  grid-column-end: 2;
`

const ImageContainer = styled.div`
  display: flex;
  justify-self: center;
  position: relative;
  width: 100%;
  height: 100%;
`

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledBodyLong = styled(BodyLong)`
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`
