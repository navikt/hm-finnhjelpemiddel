'use client'

import { RefObject, useState } from 'react'

import { Alert, BodyLong, Button, HStack, VStack } from '@navikt/ds-react'

import useRestoreScroll from '@/hooks/useRestoreScroll'
import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'
import { FormSearchData } from '@/utils/search-state-util'
import { useFormContext } from 'react-hook-form'
import { logVisFlereTreff } from '@/utils/amplitude'
import ProductCardSearch from '@/app/sok/ProductCardSearch'

const SearchResults = ({
  products,
  loadMore,
  isLoading,
  formRef,
}: {
  loadMore?: () => void
  isLoading: boolean
  products?: Product[] | undefined
  formRef: RefObject<HTMLFormElement>
}) => {
  const formMethods = useFormContext<FormSearchData>()
  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)

  const handleSetIsoFilter = (value: string) => {
    formMethods.setValue(`filters.produktkategori`, [value])
    formRef.current?.requestSubmit()
  }

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

  if (!products?.length || products.length === 0) {
    return (
      <div id="searchResults">
        <Alert variant="info">
          {!isHideUtgåttActive ? (
            <BodyLong>Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</BodyLong>
          ) : (
            <HStack gap="1">
              <BodyLong>Obs! Fant ingen hjelpemiddel. Kan hjelpemiddelet være utgått? </BodyLong>
              <Button variant="tertiary" onClick={handleSetUtgåttFilter} size="xsmall">
                Vis utgåtte hjelpemidler
              </Button>
            </HStack>
          )}
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
              handleIsoButton={handleSetIsoFilter}
              handleCompareClick={handleCompareClick}
              searchResultPlacement={index}
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
