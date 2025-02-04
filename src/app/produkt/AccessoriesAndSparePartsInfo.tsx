'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { BodyLong, HStack, Heading, VStack } from '@navikt/ds-react'

import ReadMore from '@/components/ReadMore'
import { Product } from '@/utils/product-util'
import './product-page.scss'
import { ProductCardHorizontal } from '@/app/produkt/ProductCardHorizontal'

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

  if (!products.length) {
    return (
      <VStack>
        <div
          className="product-page__header_anchorOffset"
          id={type === 'Accessories' ? 'tilbehør' : 'reservedeler'}
          tabIndex={-1}
        ></div>
        <Heading level="2" size="large" spacing>
          <Link
            href={type === 'Accessories' ? '#tilbehør' : '#reservedeler'}
            className="product-page__header_anchorLink"
          >
            {type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
          </Link>
        </Heading>

        <BodyLong>
          Det er ingen {type === 'Accessories' ? 'tilbehør' : 'reservedeler'} registrert som passer til dette produktet
        </BodyLong>
      </VStack>
    )
  }

  return (
    <VStack>
      <div
        className="product-page__header_anchorOffset"
        id={type === 'Accessories' ? 'tilbehør' : 'reservedeler'}
        tabIndex={-1}
      ></div>
      <Heading level="2" size="large" spacing>
        <Link href={type === 'Accessories' ? '#tilbehør' : '#reservedeler'} className="product-page__header_anchorLink">
          {type === 'Accessories' ? 'Tilbehør' : 'Reservedeler'}
        </Link>
      </Heading>
      <HStack gap="4">
        {firstProducts.map((acc, i) => (
          <ProductCardHorizontal key={i} product={acc} />
        ))}
        {lastProducts && (
          <ReadMore
            content={
              <HStack className="spacing-bottom--small">
                {lastProducts.map((acc, i) => (
                  <ProductCardHorizontal key={i} product={acc} />
                ))}
              </HStack>
            }
            buttonOpen={`Vis alle ${type === 'Accessories' ? 'tilbehør' : 'reservedeler'}`}
            buttonClose={`Vis færre ${type === 'Accessories' ? 'tilbehør' : 'reservedeler'}`}
            setFocus={setFocusOnHeading}
          />
        )}
      </HStack>
    </VStack>
  )
}

export default AccessoriesAndSparePartsInfo
