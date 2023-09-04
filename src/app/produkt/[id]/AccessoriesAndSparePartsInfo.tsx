'use client'

import React, { useRef } from 'react'

import { BodyLong, Heading } from '@navikt/ds-react'

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
  const classname = type === 'Accessories' ? '__accessories' : '__spare-parts'

  if (!products.length) {
    return (
      <section
        className={`spareparts-and-accessories spareparts-and-accessories${classname}`}
        aria-label={type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
      >
        <div className="spareparts-and-accessories__content max-width">
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
    <section
      className={`spareparts-and-accessories spareparts-and-accessories${classname}`}
      aria-label={type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
    >
      <div className="spareparts-and-accessories__content max-width">
        <Heading level="2" size="medium" spacing ref={headingRef}>
          {type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
        </Heading>
        <div className="spareparts-and-accessories__card-container">
          {firstProducts.map((acc, i) => (
            <ProductCardHorizontal key={i} product={acc} />
          ))}
          {lastProducts && (
            <ReadMore
              content={
                <div className="spareparts-and-accessories__card-container">
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
  )
}

export default AccessoriesAndSparePartsInfo
