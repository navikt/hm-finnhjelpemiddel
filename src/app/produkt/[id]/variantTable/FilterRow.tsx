'use client'

import { Box, Chips, Heading, HStack, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { ProductVariant } from '@/utils/product-util'
import { Filter, FilterType, TechDataRow } from '@/app/produkt/[id]/variantTable/VariantTable'
import styles from './FilterRow.module.scss'

type Props = {
  variants: ProductVariant[]
  filterConfigs: Filter[]
  techDataRows: TechDataRow[]
  numberOfVariantsToShow: number
}

type SelectFilterContents = {
  name: string
  label: string
  type: FilterType
  values: string[]
  unit: string | undefined
}

export const FilterRow = ({ variants, filterConfigs, techDataRows, numberOfVariantsToShow }: Props) => {
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

  const filters: SelectFilterContents[] = filterConfigs
    .filter(
      ({ fieldName, type }) =>
        (type === FilterType.DROPDOWN && isRelevantDropdownFilter(fieldName)) ||
        (type === FilterType.TOGGLE && isRelevantToggleFilter(fieldName))
    )
    .map(({ fieldName, label, type }) => {
      const values = variants
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

      const sortedUniqueValues = Array.from(new Set(values.map((value) => `${value}`))).sort((a, b) => {
        if (parseInt(a) && parseInt(b)) {
          return parseInt(a) - parseInt(b)
        }
        return a.localeCompare(b)
      })

      return {
        name: fieldName,
        label: label,
        type: type,
        values: sortedUniqueValues,
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
    <Box asChild paddingBlock={'space-32 space-24'} paddingInline={'space-32'} className={styles.wrapper}>
      <VStack gap={'space-16'}>
        <HStack gap={{ xs: 'space-32', md: 'space-80' }} width={'fit-content'} align={'end'}>
          <SelectFilters filters={dropdownFilters} onFilterChange={onFilterChange} />
          <ChipFilters filters={toggleFilters} onFilterChange={onFilterChange} />
        </HStack>
        <Heading level="3" size="small">
          {`${numberOfVariantsToShow} av ${variants.length} varianter`}
        </Heading>
      </VStack>
    </Box>
  )
}

const ChipFilters = ({
  filters,
  onFilterChange,
}: {
  filters: SelectFilterContents[]
  onFilterChange: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()

  return (
    <Chips className={styles.chipsRow}>
      {filters.map(({ name, label, values }) => {
        return (
          <Chips.Toggle
            selected={searchParams.has(name)}
            checkmark={true}
            key={name}
            onClick={() => onFilterChange(name, searchParams.has(name) ? '' : 'true')}
            disabled={values.length < 2}
            className={values.length < 2 ? styles.disabledChip : styles.enabledChip}
          >
            {label}
          </Chips.Toggle>
        )
      })}
    </Chips>
  )
}

const SelectFilters = ({
  filters,
  onFilterChange,
}: {
  filters: SelectFilterContents[]
  onFilterChange: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()
  return (
    <HStack gap={'space-32'}>
      {filters.map(({ name, label, values, unit }, index) => {
        return (
          values.length > 0 && (
            <Select
              key={index + 1}
              label={label}
              onChange={(event) => onFilterChange(name, event.target.value)}
              value={searchParams.get(name) ?? ''}
            >
              <option key="" value="">
                Velg
              </option>
              {values.map((value, i) => (
                <option key={i + 1} label={value + (unit ? ` ${unit}` : '')}>
                  {value}
                </option>
              ))}
            </Select>
          )
        )
      })}
    </HStack>
  )
}
