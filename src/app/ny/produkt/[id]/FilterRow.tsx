'use client'

import { Chips, HStack, Select, VStack } from '@navikt/ds-react'
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
}

type Filter = { name: string; values: string[]; unit: string | undefined }

export const FilterRow = ({ variants, filterFieldNames, filterFunction, techDataRows }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: Filter[] = filterFieldNames
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

      return {
        name: filterFieldName,
        values: Array.from(new Set(values.map((value) => `${value}`))).sort(),
        unit: techDataRows.find(({ key }) => key.startsWith(filterFieldName))?.unit,
      }
    })
    .filter(({ values }) => values.length > 1)

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

  const onSelectFilter = (name: string, value: string) => {
    const newSearchParams = createQueryString(name, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const resetFilterAll = () => {
    router.replace(`${pathname}`, { scroll: false })
  }

  const filterIsSet = useMemo(
    () =>
      Array.from(searchParams).some(([param, _]) =>
        filterFieldNames.some((filterFieldName) => filterFieldName === param)
      ),
    [searchParams, filterFieldNames]
  )

  return (
    <VStack gap={'4'}>
      <HStack gap={'8'} width={'fit-content'} align={'end'}>
        <SeteSelect filters={filters} selectFilter={onSelectFilter} />

        {filterIsSet && (
          <Chips className={styles.resetFiltersButton}>
            {
              <Chips.Removable variant="neutral" onClick={resetFilterAll}>
                Nullstill
              </Chips.Removable>
            }
          </Chips>
        )}
      </HStack>
    </VStack>
  )
}

const SeteSelect = ({
  filters,
  selectFilter,
}: {
  filters: Filter[]
  selectFilter: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()
  return (
    <>
      {filters.map(({ name, values, unit }, index) => {
        return (
          values.length > 0 && (
            <Select
              key={index + 1}
              label={name}
              onChange={(event) => selectFilter(name, event.target.value)}
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
    </>
  )
}
