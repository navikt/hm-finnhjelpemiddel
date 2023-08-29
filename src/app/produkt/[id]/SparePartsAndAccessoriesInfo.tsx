'use client'

import React from 'react'

import { Heading } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import SparePartAccessoryCard from '@/components/SparePartAccessoryCard'

type Props = {
  products: Product[]
  type: 'Spare parts' | 'Accessories'
}

const SparePartsAndAccessoriesInfo = ({ products, type }: Props) => {
  const classname = type === 'Accessories' ? '__accessories' : '__spare-parts'
  return (
    <section
      className={`spareparts-and-accessories spareparts-and-accessories${classname}`}
      aria-label={type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
    >
      <div className="spareparts-and-accessories__content max-width">
        <Heading level="2" size="medium" spacing>
          {type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
        </Heading>
        <div className="spareparts-and-accessories__card-container">
          {products.map((acc, i) => (
            <SparePartAccessoryCard key={i} product={acc} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SparePartsAndAccessoriesInfo
