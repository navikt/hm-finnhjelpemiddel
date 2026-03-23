'use client'

import React, { useState } from 'react'
import { Alert, BodyLong, BodyShort, Button, Heading, HStack, Tag, VStack } from '@navikt/ds-react'
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
      <VStack gap={'space-48'}>
        {Object.entries(delkontraktGroups)
          .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
          .map(([delkontraktName, delkontraktGroup]) => {
            return (
              <VStack key={delkontraktName} gap={'space-16'} style={{ borderTop: '1px solid #CFD3D8' }}>
                <HStack gap={'space-8'} align={'center'} paddingBlock={'space-16 space-0'}>
                  {delkontraktGroup.refNr !== '0' && (
                    <Tag size={'medium'} data-color={'info'} variant={'moderate'}>
                      Delkontrakt {delkontraktGroup.refNr}
                    </Tag>
                  )}
                  <Heading size={'small'}>{delkontraktGroup.title}</Heading>
                </HStack>
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
      </VStack>
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
    refNr: string
    title: string
    products: Product[]
  }
}

const groupByDelkontrakt = (products: Product[] | undefined): ProductsDelkontrakt => {
  const productsByDelkonktrakt: ProductsDelkontrakt = {}

  products?.forEach((product) => {
    if (product.agreements.length === 0) {
      if (!productsByDelkonktrakt['Ikke på avtale']) {
        productsByDelkonktrakt['Ikke på avtale'] = { refNr: '0', title: 'Ikke på avtale', products: [] }
      }

      productsByDelkonktrakt['Ikke på avtale'].products.push(product)
    }

    product.agreements.forEach((agreement) => {
      const delkontrakt = agreement.postTitle!
      const normalizedTitle = delkontrakt.split(/[):.]\s*/)

      if (delkontrakt !== null) {
        if (!productsByDelkonktrakt[delkontrakt]) {
          productsByDelkonktrakt[delkontrakt] = { refNr: agreement.refNr!, title: normalizedTitle[1], products: [] }
        }

        productsByDelkonktrakt[delkontrakt].products.push(product)
      }
    })
  })

  return productsByDelkonktrakt
}
