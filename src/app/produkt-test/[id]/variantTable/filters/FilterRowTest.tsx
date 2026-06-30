'use client'

import { Heading, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { ProductVariant } from '@/utils/product-util'
import { Filter, FilterType, TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'
import { SelectFilters } from '@/app/produkt-test/[id]/variantTable/filters/SelectFilters'
import { ChipFilters } from '@/app/produkt-test/[id]/variantTable/filters/ChipFilters'

type Props = {
  variants: ProductVariant[]
  filterConfigs: Filter[]
  techDataRows: TechDataRow[]
}

export type FilterContent = {
  name: string
  label: string
  type: FilterType
  values: string[]
  valueRange: string[] | undefined
  unit: string | undefined
}

export const FilterRowTest = ({ variants, filterConfigs, techDataRows }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const searchTermMatchesHms =
    searchParams.get('term') &&
    variants
      .flatMap((variant) => [variant.hmsArtNr?.toLocaleLowerCase()])
      .includes(searchParams.get('term')!.toLowerCase())
  const searchTermMatchesSupplierRef =
    searchParams.get('term') &&
    variants
      .flatMap((variant) => [variant.supplierRef?.toLocaleLowerCase()])
      .includes(searchParams.get('term')!.toLowerCase())

  const isRelevantDropdownFilter = (name: string) => {
    return techDataRows.some(
      ({ key, isCommonField }) => [name, `${name} min`, `${name} maks`].some((field) => field === key) && !isCommonField
    )
  }

  const isRelevantToggleFilter = (name: string) => {
    if (name === 'agreement') return new Set(variants.map((v) => v.hasAgreement)).size > 1
    if (name === 'term') return searchParams.get('term') && (searchTermMatchesHms || searchTermMatchesSupplierRef)
    return false
  }

  const getDropdownFilterValues = (variant: ProductVariant, fieldName: string): string[] => {
    const isMinMax = variant.techData[`${fieldName} min`] && variant.techData[`${fieldName} maks`]

    if (isMinMax) {
      const minValue = parseInt(variant.techData[`${fieldName} min`].value)
      const maxValue = parseInt(variant.techData[`${fieldName} maks`].value)

      if (minValue >= maxValue) {
        return [minValue.toString()]
      }

      const rangeOfNumbers = (a: number, b: number) => [...Array(b - a + 1)].map((_, i) => i + a)
      const valueIntervals = rangeOfNumbers(minValue, maxValue)

      return valueIntervals.map((number) => number.toString())
    }

    if (variant.techData[fieldName]) {
      return [variant.techData[fieldName].value.trim()]
    }

    return []
  }

  const getToggleFilterValue = (variant: ProductVariant, fieldName: string): boolean[] => {
    if (fieldName === 'agreement') {
      return [variant.hasAgreement]
    }
    if (fieldName === 'term') {
      const searchTerm = searchParams.get('term')?.toLocaleLowerCase()
      return searchTerm
        ? [
            variant.hmsArtNr?.toLocaleLowerCase() === searchTerm ||
              variant.supplierRef?.toLocaleLowerCase() === searchTerm,
          ]
        : []
    }
    return []
  }

  const filters: FilterContent[] = filterConfigs
    .filter(
      ({ fieldName, type }) =>
        (type === FilterType.DROPDOWN && isRelevantDropdownFilter(fieldName)) ||
        (type === FilterType.TOGGLE && isRelevantToggleFilter(fieldName))
    )
    .map(({ fieldName, label, type }) => {
      const filterValues = variants
        .map((variant) => {
          const otherFilters = filterConfigs.filter((otherFilter) => otherFilter.fieldName !== fieldName)

          //hvis varianten passerer alle aktive filtere utenom gjeldene filter, legg til verdiene fra varianten
          if (otherFilters.every((otherFilter) => otherFilter.predicate(variant, otherFilter.fieldName))) {
            if (type === FilterType.DROPDOWN) {
              return getDropdownFilterValues(variant, fieldName)
            }
            if (type === FilterType.TOGGLE) {
              return getToggleFilterValue(variant, fieldName)
            }
          }

          return []
        })
        .flat()

      const unit = techDataRows.find(({ key }) => key.startsWith(fieldName))?.unit

      const sortedUniqueValues = Array.from(new Set(filterValues.map((value) => `${value}`))).sort((a, b) => {
        if (parseInt(a) && parseInt(b)) {
          return parseInt(a) - parseInt(b)
        }
        return a.localeCompare(b)
      })

      let valueRangeUnfiltered: undefined | string[] = undefined
      if (type === FilterType.DROPDOWN) {
        const unfilteredValues = variants
          .map((variant) => getDropdownFilterValues(variant, fieldName))
          .flat()
          .map(Number)
        if (unfilteredValues.length > 1 && unfilteredValues.every(Number.isInteger)) {
          valueRangeUnfiltered = [Math.min(...unfilteredValues).toString(), Math.max(...unfilteredValues).toString()]
        }
      }

      return {
        name: fieldName,
        label: label,
        type: type,
        values: sortedUniqueValues,
        valueRange: valueRangeUnfiltered,
        unit: unit,
      }
    })

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.length === 0) {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      return params.toString()
    },
    [searchParams]
  )

  const onFilterChange = (name: string, value: string) => {
    const newSearchParams = createQueryString(name, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  if (filters.length === 0) {
    return (
      <VStack paddingBlock={'space-0 space-24'}>
        <Heading level="3" size="small">
          {`${variants.length} varianter`}
        </Heading>
      </VStack>
    )
  }

  const dropdownFilters = filters.filter((filter) => filter.type === FilterType.DROPDOWN)
  const toggleFilters = filters.filter((filter) => filter.type === FilterType.TOGGLE)

  return (
    <VStack gap={'space-16'}>
      <VStack gap={'space-16'} width={'fit-content'}>
        <SelectFilters filters={dropdownFilters} onFilterChange={onFilterChange} />
        <ChipFilters filters={toggleFilters} onFilterChange={onFilterChange} />
      </VStack>
    </VStack>
  )
}
