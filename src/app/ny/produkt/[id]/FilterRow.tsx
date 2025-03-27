'use client'

import { Chips, HStack, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { ProductVariant } from '@/utils/product-util'
import { TechDataRow, VariantFilter } from '@/app/ny/produkt/[id]/VariantTable'
import styles from './FilterRow.module.scss'

type Props = {
  variants: ProductVariant[]
  variantFilters: VariantFilter[]
  techDataRows: TechDataRow[]
}

type Filter = { name: string; values: string[] }

export const FilterRow = ({ variants, variantFilters, techDataRows }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: Filter[] = variantFilters
    .filter(({ name }) => techDataRows.some(({ key, isCommonField }) => key.startsWith(name) && !isCommonField))
    .map(({ name }) => {
      const values = variants
        .map((variant) => {
          const otherFilters = variantFilters.filter((variantFilter) => variantFilter.name !== name)

          if (otherFilters.every((variantFilter) => variantFilter.filterFunction(variant))) {
            const isMinMax =
              Object.keys(variant.techData).filter((key) => key === `${name} min` || key === `${name} maks`).length ===
              2

            if (isMinMax) {
              const minValue = parseInt(variant.techData[`${name} min`].value)
              const maxValue = parseInt(variant.techData[`${name} maks`].value)
              const rangeOfNumbers = (a: number, b: number) => [...Array(b - a + 1)].map((_, i) => i + a)

              if (minValue === maxValue || minValue > maxValue) {
                return [minValue]
              }

              const valueIntervals = rangeOfNumbers(
                parseInt(variant.techData[`${name} min`].value),
                parseInt(variant.techData[`${name} maks`].value)
              )

              return valueIntervals.map((number) => number.toString())
            }

            return Object.entries(variant.techData)
              .filter(([key]) => key === name)
              .map(([_, techDataField]) => techDataField.value)
          }

          return []
        })
        .flat()

      return {
        name: name,
        values: Array.from(new Set(values.map((value) => `${value} cm`))).sort(),
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

  const onSelectFilter = (name: string, value: string) => {
    const newSearchParams = createQueryString(name, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const resetFilterAll = () => {
    router.replace(`${pathname}`, { scroll: false })
  }

  const filterIsSet = useMemo(
    () => searchParams.entries().some(([param, _]) => variantFilters.some((filter) => filter.name === param)),
    [searchParams, variantFilters]
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
      {filters.map(({ name, values }, index) => {
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
                <option key={i + 1}>{value}</option>
              ))}
            </Select>
          )
        )
      })}
    </>
  )
}
