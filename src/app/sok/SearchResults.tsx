'use client'

import { useState } from 'react'

import { Alert, BodyLong, Button, HStack, VStack } from '@navikt/ds-react'

import useRestoreScroll from '@/hooks/useRestoreScroll'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { logVisFlereTreff } from '@/utils/amplitude'
import ProductCardSearch from '@/app/sok/ProductCardSearch'

const SearchResults = ({
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

  useRestoreScroll('search-results', !isLoading)

  if (!products?.length || products.length === 0) {
    return (
      <div id="searchResults">
        <Alert variant="info">
          <BodyLong>Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</BodyLong>
        </Alert>
      </div>
    )
  }

  return (
    <VStack gap="4">
      <HStack
        as={'ol'}
        gap={{ xs: '4', md: '5' }}
        id="searchResults"
        className="search-results"
        justify={{ xs: 'start', md: 'start' }}
      >
        {products.map((product, index) => (
          <li key={product.id}>
            <ProductCardSearch
              product={product}
              handleCompareClick={handleCompareClick}
              searchResultPlacement={index + 1}
            />
          </li>
        ))}
      </HStack>
      {loadMore && (
        <Button
          variant="secondary"
          onClick={() => {
            loadMore()
            logVisFlereTreff()
          }}
          loading={isLoading}
        >
          Vis flere treff
        </Button>
      )}
    </VStack>
  )
}

export default SearchResults
