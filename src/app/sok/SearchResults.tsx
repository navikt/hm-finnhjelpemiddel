import { RefObject } from 'react'

import { Alert, BodyShort, Button, HStack, Heading, Loader, VStack } from '@navikt/ds-react'

import { FetchProductsWithFilters, SearchData } from '@/utils/api-util'

import useRestoreScroll from '@/hooks/useRestoreScroll'

import ProductCard from '@/components/ProductCard'
import SortSearchResults from '@/components/SortSearchResults'
import { useFormContext } from 'react-hook-form'

const SearchResults = ({
  data,
  loadMore,
  isLoading,
  searchResultRef,
  formRef,
}: {
  loadMore?: () => void
  isLoading: boolean
  data?: Array<FetchProductsWithFilters>
  searchResultRef: RefObject<HTMLHeadingElement>
  formRef: RefObject<HTMLFormElement>
}) => {
  const products = data?.map((d) => d.products).flat()
  const formMethods = useFormContext<SearchData>()

  const handleSetIsoFilter = (value: string) => {
    formMethods.setValue(`filters.produktkategori`, [value])
    formRef.current?.requestSubmit()
  }

  useRestoreScroll('search-results', !isLoading)

  if (!data) {
    return (
      <VStack gap="8">
        <HStack justify="space-between">
          <VStack justify="space-between">
            <Heading level="2" size="small" ref={searchResultRef}>
              Hjelpemiddel
            </Heading>
            <BodyShort aria-live="polite" style={{ marginLeft: '2px' }}>{`Ingen treff`}</BodyShort>
          </VStack>

          <SortSearchResults formRef={formRef} />
        </HStack>

        <div id="searchResults" className="results__loader">
          <Loader size="3xlarge" title="Laster produkter" />
        </div>
      </VStack>
    )
  }

  if (!products?.length) {
    return (
      <VStack gap="8">
        <HStack justify="space-between">
          <VStack justify="space-between">
            <Heading level="2" size="small" ref={searchResultRef}>
              Hjelpemiddel
            </Heading>
            <BodyShort aria-live="polite" style={{ marginLeft: '2px' }}>{`Ingen treff`}</BodyShort>
          </VStack>

          <SortSearchResults formRef={formRef} />
        </HStack>
        <div id="searchResults">
          <Alert variant="info">Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</Alert>
        </div>
      </VStack>
    )
  }

  return (
    <>
      <HStack justify="space-between" className="results__header">
        <VStack justify="space-between">
          <Heading level="2" size="small" ref={searchResultRef}>
            Hjelpemiddel
          </Heading>
          <BodyShort aria-live="polite" style={{ marginLeft: '2px' }}>{`Viser de ${products.length} første`}</BodyShort>
        </VStack>

        <SortSearchResults formRef={formRef} />
      </HStack>

      <HStack as={'ol'} gap={{ xs: '4', md: '5' }} id="searchResults" className="search-results">
        {products.map((product) => (
          <li>
            <ProductCard product={product} handleIsoButton={handleSetIsoFilter} type="large-with-checkbox" />
          </li>
        ))}
      </HStack>
      {loadMore && (
        <Button variant="secondary" onClick={loadMore} loading={isLoading}>
          Vis flere treff
        </Button>
      )}
    </>
  )
}

export default SearchResults
