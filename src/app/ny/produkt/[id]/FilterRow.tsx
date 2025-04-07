'use client'

import { Box, Chips, Heading, HStack, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { ProductVariant } from '@/utils/product-util'
import { TechDataRow } from '@/app/ny/produkt/[id]/VariantTable'
import styles from './FilterRow.module.scss'

type Props = {
  variants: ProductVariant[]
  filterFieldNames: string[]
  filterFunction: (variant: ProductVariant, filterFieldName: string) => boolean
  techDataRows: TechDataRow[]
  numberOfVariantsToShow: number
}

type SelectFilterContents = { name: string; values: string[]; unit: string | undefined }

export const FilterRow = ({
  variants,
  filterFieldNames,
  filterFunction,
  techDataRows,
  numberOfVariantsToShow,
}: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: SelectFilterContents[] = filterFieldNames
    .filter((name) => techDataRows.some(({ key, isCommonField }) => key.startsWith(name) && !isCommonField))
    .map((filterFieldName) => {
      const values = variants
        .map((variant) => {
          const otherFilters = filterFieldNames.filter(
            (otherFilterFieldName) => otherFilterFieldName !== filterFieldName
          )

          if (otherFilters.every((otherFilterFieldName) => filterFunction(variant, otherFilterFieldName))) {
            const isMinMax = variant.techData[`${filterFieldName} min`] && variant.techData[`${filterFieldName} maks`]

            if (isMinMax) {
              const minValue = parseInt(variant.techData[`${filterFieldName} min`].value)
              const maxValue = parseInt(variant.techData[`${filterFieldName} maks`].value)

              if (minValue >= maxValue) {
                return [minValue]
              }

              const rangeOfNumbers = (a: number, b: number) => [...Array(b - a + 1)].map((_, i) => i + a)
              const valueIntervals = rangeOfNumbers(minValue, maxValue)

              return valueIntervals.map((number) => number.toString())
            }

            if (variant.techData[filterFieldName]) {
              return variant.techData[filterFieldName].value.trim()
            }
          }

          return []
        })
        .flat()

      const unit = techDataRows.find(({ key }) => key.startsWith(filterFieldName))?.unit

      const sortedUniqueValues = Array.from(new Set(values.map((value) => `${value}`))).sort((a, b) => {
        if (parseInt(a) && parseInt(b)) {
          return parseInt(a) - parseInt(b)
        }
        return a.localeCompare(b)
      })

      return {
        name: filterFieldName,
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

  const resetFilterAll = () => {
    router.replace(`${pathname}`, { scroll: false })
  }

  /*
  const hasActiveFilter = useMemo(
    () =>
      Array.from(searchParams).some(([param, _]) =>
        filterFieldNames.some((filterFieldName) => filterFieldName === param)
      ),
    [searchParams, filterFieldNames]
  )
   */
  const hasActiveFilter = false

  const showOnAgreementFilter = new Set(variants.map((variant) => variant.hasAgreement)).size > 1

  if (filters.length === 0 && !showOnAgreementFilter) {
    return <></>
  }

  return (
    <Box asChild background={'surface-selected'} paddingBlock={'8 6'} paddingInline={'8'}>
      <VStack gap={'4'}>
        <HStack gap={'20'} width={'fit-content'} align={'end'}>
          <SelectFilters filters={filters} onFilterChange={onFilterChange} />
          {showOnAgreementFilter && <ChipFilters filterNames={['status']} onFilterChange={onFilterChange} />}

          {hasActiveFilter && (
            <Chips className={styles.resetFiltersButton}>
              {
                <Chips.Removable variant="neutral" onClick={resetFilterAll}>
                  Nullstill
                </Chips.Removable>
              }
            </Chips>
          )}
        </HStack>
        <Heading level="3" size="small">
          {`${numberOfVariantsToShow} av ${variants.length} varianter`}
        </Heading>
      </VStack>
    </Box>
  )
}

const ChipFilters = ({
  filterNames,
  onFilterChange,
}: {
  filterNames: string[]
  onFilterChange: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()

  return (
    <Chips className={styles.chipsRow}>
      {filterNames.map((filterName) => (
        <Chips.Toggle
          selected={searchParams.has(filterName)}
          checkmark={true}
          key={filterName}
          onClick={() => onFilterChange(filterName, searchParams.has(filterName) ? '' : 'På avtale')}
        >
          På avtale med nav
        </Chips.Toggle>
      ))}
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
    <HStack gap={'8'}>
      {filters.map(({ name, values, unit }, index) => {
        return (
          values.length > 0 && (
            <Select
              key={index + 1}
              label={name}
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
