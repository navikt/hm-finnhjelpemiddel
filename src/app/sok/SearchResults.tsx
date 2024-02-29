import { RefObject } from 'react'

import { Alert, Button, HStack, VStack } from '@navikt/ds-react'

import { SearchData } from '@/utils/api-util'

import useRestoreScroll from '@/hooks/useRestoreScroll'

import ProductCard from '@/components/ProductCard'
import { Product } from '@/utils/product-util'
import { useFormContext } from 'react-hook-form'

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
  const formMethods = useFormContext<SearchData>()

  const handleSetIsoFilter = (value: string) => {
    formMethods.setValue(`filters.produktkategori`, [value])
    formRef.current?.requestSubmit()
  }

  useRestoreScroll('search-results', !isLoading)

  if (!products?.length || products.length === 0) {
    return (
      <div id="searchResults">
        <Alert variant="info">Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</Alert>
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
        justify={{ xs: 'center', md: 'start' }}
      >
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} handleIsoButton={handleSetIsoFilter} type="large-with-checkbox" />
          </li>
        ))}
      </HStack>
      {loadMore && (
        <Button variant="secondary" onClick={loadMore} loading={isLoading}>
          Vis flere treff
        </Button>
      )}
    </VStack>
  )
}

export default SearchResults
