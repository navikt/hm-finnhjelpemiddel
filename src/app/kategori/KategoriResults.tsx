'use client'

import { useState } from 'react'
import { Alert, BodyLong, Button, HStack, VStack } from '@navikt/ds-react'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { ProductCardKategori } from '@/app/kategori/ProductCardKategori'
import styles from './KategoriResults.module.scss'

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
      <div id="searchResults">
        <Alert variant="info">
          <BodyLong>Obs! Fant ingen hjelpemidler. Har du sjekket filtrene dine?</BodyLong>
        </Alert>
      </div>
    )
  }

  return (
    <VStack gap="space-16">
      <HStack
        gap={{ xs: 'space-16', md: 'space-20' }}
        id="searchResults"
        className="search-results"
        justify={{ xs: 'start', md: 'start' }}
      >
        {products?.map((product) => (
          <ProductCardKategori
            key={product.id}
            product={product}
            variantCount={product.variantCount}
            handleCompareClick={handleCompareClick}
          />
        ))}
      </HStack>
      {loadMore && !isLoading && (
        <HStack className={styles.container}>
          <Button
            variant="primary"
            className={styles.buttonShowMore}
            onClick={() => {
              loadMore()
            }}
          >
            Vis flere treff
          </Button>
        </HStack>
      )}
    </VStack>
  )
}
