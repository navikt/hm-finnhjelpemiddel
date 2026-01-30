'use client'

import { RefObject, useState } from 'react'

import { Alert, BodyLong, Button, HStack, VStack } from '@navikt/ds-react'

import useRestoreScroll from '@/hooks/useRestoreScroll'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { FormSearchData } from '@/utils/search-state-util'
import { useFormContext } from 'react-hook-form'
import { ProductCardSearch } from '@/app/sok/ProductCardSearch'

const SearchResults = ({
  products,
  loadMore,
  isLoading,
  formRef,
}: {
  loadMore?: () => void
  isLoading: boolean
  products?: Product[] | undefined
  formRef: RefObject<HTMLFormElement | null>
}) => {
  const formMethods = useFormContext<FormSearchData>()
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  const visFilters = formMethods.getValues(`filters.vis`)
  const isHideUtgåttActive = visFilters.includes('Skjul utgåtte hjelpemidler')

  const handleSetUtgåttFilter = () => {
    const visFiltersUpdated = visFilters.filter((item) => item !== 'Skjul utgåtte hjelpemidler')
    formMethods.setValue(`filters.vis`, visFiltersUpdated)
    formRef.current?.requestSubmit()
  }

  useRestoreScroll('search-results', !isLoading)

  if (products && products.length === 0) {
    return (
      <div id="searchResults">
        <Alert variant="info">
          {!isHideUtgåttActive ? (
            <BodyLong>Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</BodyLong>
          ) : (
            <HStack gap="space-4">
              <BodyLong>Obs! Fant ingen hjelpemiddel. Kan hjelpemiddelet være utgått? </BodyLong>
              <Button variant="tertiary" onClick={handleSetUtgåttFilter} size="xsmall">
                Vis utgåtte hjelpemidler
              </Button>
            </HStack>
          )}
        </Alert>
      </div>
    );
  }

  return (
    <VStack gap="space-16">
      <HStack
        gap={{ xs: "space-16", md: "space-20" }}
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
          }}
        >
          Vis flere treff
        </Button>
      )}
    </VStack>
  );
}

export default SearchResults
