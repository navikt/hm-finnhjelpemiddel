'use client'

import React, { useRef } from 'react'

import { Bleed, BodyLong, Heading } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import ProductCardHorizontal from '@/components/ProductCardHorizontal'
import ReadMore from '@/components/ReadMore'

import './product-page.scss'

type Props = {
  products: Product[]
  type: 'Spare parts' | 'Accessories'
}

const AccessoriesAndSparePartsInfo = ({ products, type }: Props) => {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const setFocusOnHeading = () => {
    headingRef.current && headingRef.current.scrollIntoView({ behavior: 'smooth' })
  }
  const firstProducts = products.slice(0, 4)
  const lastProducts = products.length > 4 && products.slice(4)
  const classname = type === 'Accessories' ? '__yellow-background' : '__blue-background'

  if (!products.length) {
    return (
      <section
        className={`product-page-section__container product-page-section${classname}`}
        aria-label={type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
      >
        <div className="product-page-section__content">
          <Heading level="2" size="medium" spacing ref={headingRef}>
            {type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
          </Heading>
          <BodyLong>
            Det er ingen {type === 'Accessories' ? 'tilbehør' : 'reservedeler'} registrert som passer til dette
            produktet
          </BodyLong>
        </div>
      </section>
    )
  }

  return (
    <Bleed marginInline="full" asChild>
      <section
        className={`product-page-section__container product-page-section${classname}`}
        aria-label={type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
      >
        <div className="product-page-section__content main-wrapper">
          <Heading level="2" size="medium" spacing ref={headingRef}>
            {type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
          </Heading>
          <div className="product-page-section__card-container">
            {firstProducts.map((acc, i) => (
              <ProductCardHorizontal key={i} product={acc} />
            ))}
            {lastProducts && (
              <ReadMore
                content={
                  <div className="product-page-section__card-container">
                    {lastProducts.map((acc, i) => (
                      <ProductCardHorizontal key={i} product={acc} />
                    ))}
                  </div>
                }
                buttonOpen={`Vis alle ${type === 'Accessories' ? 'tilbehør' : 'reservedeler'}`}
                buttonClose={`Vis færre ${type === 'Accessories' ? 'tilbehør' : 'reservedeler'}`}
                setFocus={setFocusOnHeading}
              />
            )}
          </div>
        </div>
      </section>
    </Bleed>
  )
}

export default AccessoriesAndSparePartsInfo
