'use client'

import React, { useState } from 'react'
import { Alert, BodyLong, BodyShort, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { ProductCardKategori } from '@/app/kategori/ProductCardKategori'
import { ChevronDownIcon } from '@navikt/aksel-icons'

export const KategoriResults = ({
  products,
  loadMore,
  isLoading,
}: {
  loadMore?: (() => void) | undefined
  isLoading: boolean
  products?: Product[] | undefined
}) => {
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  if (products && products.length === 0) {
    return (
      <Alert variant="info">
        <BodyLong>Obs! Fant ingen hjelpemidler. Har du sjekket filtrene dine?</BodyLong>
      </Alert>
    )
  }
  const delkontraktGroups = groupByDelkontrakt(products)

  return (
    <VStack gap="space-16">
      <BodyShort>
        {isLoading
          ? 'Viser '
          : loadMore
            ? `Viser første ${products?.length} hjelpemidler`
            : `Viser ${products?.length} hjelpemidler`}
      </BodyShort>

      {Object.entries(delkontraktGroups)
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([delkontraktName, delkontraktGroup]) => {
          return (
            <VStack key={delkontraktName} gap={'space-4'}>
              <Heading size={'small'}>{delkontraktGroup.title}</Heading>
              <HStack
                gap={{ xs: 'space-16', md: 'space-20' }}
                key={Math.random()} //rerender-issue quickfix, problemer med swrinfinite
              >
                {delkontraktGroup.products.map((product) => (
                  <ProductCardKategori key={product.id} product={product} handleCompareClick={handleCompareClick} />
                ))}
              </HStack>
            </VStack>
          )
        })}

      {loadMore && !isLoading && (
        <Button
          variant="tertiary"
          size="medium"
          icon={<ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          onClick={loadMore}
          style={{ alignSelf: 'center' }}
        >
          Vis flere treff
        </Button>
      )}
    </VStack>
  )
}

type ProductsDelkontrakt = {
  [key: string]: {
    nr: number
    title: string
    products: Product[]
  }
}

const groupByDelkontrakt = (products: Product[] | undefined): ProductsDelkontrakt => {
  const productsByDelkonktrakt: ProductsDelkontrakt = {}

  products?.forEach((product) => {
    if (product.agreements.length === 0) {
      if (!productsByDelkonktrakt['Ikke på avtale']) {
        productsByDelkonktrakt['Ikke på avtale'] = { nr: 0, title: 'Ikke på avtale', products: [] }
      }

      productsByDelkonktrakt['Ikke på avtale'].products.push(product)
    }

    product.agreements.forEach((agreement) => {
      const delkontrakt = agreement.postTitle!
      const normalizedTitle = delkontrakt.split(/[):.]\s*/)

      if (delkontrakt !== null) {
        if (!productsByDelkonktrakt[delkontrakt]) {
          productsByDelkonktrakt[delkontrakt] = { nr: agreement.postNr, title: normalizedTitle[1], products: [] }
        }

        productsByDelkonktrakt[delkontrakt].products.push(product)
      }
    })
  })

  return productsByDelkonktrakt
}
