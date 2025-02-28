'use client'

import { Chips, HStack, Loader } from '@navikt/ds-react'
import { FilterFormState, filtersFormStateLabel, initialFiltersFormState } from '@/utils/filter-util'
import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import { FormProvider, useForm } from 'react-hook-form'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Product } from '@/utils/product-util'
import useSWR from 'swr'
import { getProductFilters } from '@/utils/api-util'
import { useEffect } from 'react'
import { FilterViewProductPage } from '@/components/filters/FilterViewProductPage'

export type ExtendedFilterFormState = FilterFormState & {
  'HMS-nummer': unknown
  'Lev-artnr': unknown
}

export const VariantFilters = ({ product }: { product: Product }) => {
  const searchParams = useSearchParams()
  const searchData = mapSearchParams(searchParams)
  const router = useRouter()
  const pathname = usePathname()
  const searchTerm = searchParams.get('term')

  const numberOfvariantsOnAgreement = product.variants.filter(
    (variant) => variant.hasAgreement && variant.status === 'ACTIVE'
  ).length
  const numberOfvariantsWithoutAgreement = product.variantCount - numberOfvariantsOnAgreement
  const numberOfvariantsExpired = product.variants.filter((variant) => variant.status === 'INACTIVE').length

  const { data: filtersFromData, isLoading: filterIsLoading } = useSWR({ seriesId: product.id }, getProductFilters, {
    keepPreviousData: true,
  })

  const relevantFilterKeys = filtersFromData
    ? Object.entries(filtersFromData)
        .filter(([_, filter]) => filter.values.length > 1)
        .flatMap(([key]) => key)
    : []

  useEffect(() => {
    const relevantFilters = {
      ...initialFiltersFormState,
      ...Object.fromEntries(
        Object.entries(searchData.filters).filter(([key]) => {
          if (['breddeMinCM', 'breddeMaxCM'].includes(key)) return relevantFilterKeys.includes('breddeCM')
          if (['lengdeMinCM', 'lengdeMaxCM'].includes(key)) return relevantFilterKeys.includes('lengdeCM')
          if (key === 'status') return true
          if (['totalVektMinKG', 'totalVektMaxKG'].includes(key)) return relevantFilterKeys.includes('totalVektKG')
          if (['brukervektMinKG', 'brukervektMaxKG'].includes(key)) return relevantFilterKeys.includes('brukervektKG')
          return relevantFilterKeys.includes(key)
        })
      ),
    }
    const currentHash = window.location.hash
    const newQueryString = toSearchQueryString({ filters: relevantFilters }, searchData.searchTerm)
    router.replace(`${pathname}?${newQueryString}${currentHash ? currentHash : ''}`, { scroll: false })
  }, [filtersFromData])

  const formMethods = useForm({
    mode: 'onSubmit',
    shouldFocusError: false,
    values: { filters: { ...initialFiltersFormState, ...searchData.filters } },
  })

  const onSubmit = () => {
    const currentHash = window.location.hash
    const newQueryString = toSearchQueryString({ filters: formMethods.getValues().filters }, searchData.searchTerm)
    router.replace(`${pathname}?${newQueryString}${currentHash ? currentHash : ''}`, { scroll: false })
  }

  const onRemoveSearchTerm = () => {
    const currentHash = window.location.hash
    const newQueryString = toSearchQueryString({ filters: formMethods.getValues().filters }, '')
    router.replace(`${pathname}?${newQueryString}${currentHash ? currentHash : ''}`, { scroll: false })
  }
  const moreThanOneStatus =
    [numberOfvariantsExpired, numberOfvariantsOnAgreement, numberOfvariantsWithoutAgreement].filter((num) => num > 0)
      .length > 1

  const statusFilter = {
    values: [
      { key: 'På avtale', doc_count: numberOfvariantsOnAgreement },
      { key: 'Ikke på avtale', doc_count: numberOfvariantsWithoutAgreement },
      { key: 'Utgått', doc_count: numberOfvariantsExpired },
    ],
  }

  const searchTermMatchesHms = product.variants
    .flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())
  const searchTermMatchesSupplierRef = product.variants
    .flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
    .includes(searchData.searchTerm?.toLowerCase())

  const showTermTag = searchTermMatchesHms || searchTermMatchesSupplierRef
  const filters = filtersFromData ? { ...filtersFromData, status: statusFilter } : filtersFromData

  const filterChips = Object.entries(searchData.filters)
    .filter(([key, values]) => values.length > 0 && key !== 'status')
    .flatMap(([key, values]) => ({
      key: key as keyof ExtendedFilterFormState,
      values: Array.isArray(values) ? values.join(', ') : values,
      label: filtersFormStateLabel[key as keyof FilterFormState],
    }))
    .concat(
      searchData.searchTerm && showTermTag
        ? [
            {
              key: searchTermMatchesHms ? 'HMS-nummer' : 'Lev-artnr',
              values: searchData.searchTerm,
              label: searchTermMatchesHms ? 'HMS-nummer' : 'Lev-artnr',
            },
          ]
        : []
    )
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} aria-controls="variants-table">
        {filterIsLoading && (
          <HStack style={{ margin: '38px' }}>
            <Loader size="xlarge" title="Laster bilde" />
          </HStack>
        )}
        {(relevantFilterKeys.length > 0 || moreThanOneStatus) && <FilterViewProductPage filters={filters} />}
        <input type="submit" style={{ display: 'none' }} />

        {(searchTerm || filterChips.length > 0) && (
          <Chips className="spacing-bottom--medium">
            {filterChips.map(({ key, label, values }, i) => (
              <Chips.Removable
                key={key + i}
                onClick={(event) => {
                  if (key === 'HMS-nummer' || key === 'Lev-artnr') {
                    onRemoveSearchTerm()
                  } else {
                    formMethods.setValue(`filters.${key}`, '')
                    event.currentTarget?.form?.requestSubmit()
                  }
                }}
              >
                {`${label}: ${values}`}
              </Chips.Removable>
            ))}
          </Chips>
        )}
      </form>
    </FormProvider>
  )
}
