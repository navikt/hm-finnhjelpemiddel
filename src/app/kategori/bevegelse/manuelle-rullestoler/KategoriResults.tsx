'use client'

import { useState } from 'react'

import { Alert, BodyLong, Button, HStack, VStack } from '@navikt/ds-react'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { logVisFlereTreff } from '@/utils/amplitude'
import { ProductCardSearch } from '@/app/sok/ProductCardSearch'

const KategoriResults = ({
  products,
  loadMore,
  isLoading,
}: {
  loadMore?: () => void
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
    <VStack gap="4">
      <HStack
        gap={{ xs: '4', md: '5' }}
        id="searchResults"
        className="search-results"
        justify={{ xs: 'start', md: 'start' }}
      >
        {products?.map((product) => (
          <ProductCardSearch
            key={product.id}
            product={product}
            variantCount={product.variantCount}
            handleCompareClick={handleCompareClick}
          />
        ))}
      </HStack>
      {loadMore && !isLoading && (
        <Button
          variant="secondary"
          onClick={() => {
            loadMore()
            logVisFlereTreff()
          }}
        >
          Vis flere treff
        </Button>
      )}
    </VStack>
  )
}

export default KategoriResults
