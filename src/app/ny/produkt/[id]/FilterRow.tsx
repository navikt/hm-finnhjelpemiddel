'use client'

import { Button, HStack, Select, VStack } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import styles from './FilterRow.module.scss'
import { ProductVariant } from '@/utils/product-util'
import { VariantFilter, VariantFilterType } from '@/app/ny/produkt/[id]/VariantTable'

type Props = {
  variants: ProductVariant[]
  variantFilters: VariantFilter[]
  dataFieldCommonality: { [key: string]: boolean }
}

export const FilterRow = ({ variants, variantFilters, dataFieldCommonality }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  console.log(dataFieldCommonality)
  const filters: { [key: string]: string[] } = Object.assign(
    {},
    ...variantFilters
      .filter(({ name }) =>
        Object.entries(dataFieldCommonality).some(([key, isCommon]) => key.startsWith(name) && !isCommon)
      )
      .map(({ name, type }) => {
        const values = variants
          .map((variant) => {
            const otherFilters = variantFilters.filter((variantFilter) => variantFilter.name !== name)

            if (otherFilters.every((variantFilter) => variantFilter.filterFunction(variant))) {
              return Object.entries(variant.techData)
                .filter(([key]) => key.startsWith(name))
                .map(([_, techDataField]) => techDataField.value)
            }

            return []
          })
          .flat()

        if (type === VariantFilterType.MIN_MAX && values.length > 0) {
          const allValues = values.map((value) => parseInt(value))

          const rangeOfNumbers = (a: number, b: number) => [...Array(b - a + 1)].map((_, i) => i + a)
          const valueIntervals = rangeOfNumbers(Math.min(...allValues), Math.max(...allValues))

          return {
            [name]: valueIntervals.map((value) => `${value} cm`),
          }
        }

        return {
          [name]: Array.from(new Set(values.map((value) => `${value} cm`))).sort(),
        }
      })
  )

  console.log('filters', filters)

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

  return (
    <VStack gap={'4'}>
      <HStack gap={'4'} width={'fit-content'}>
        <SeteSelect filters={filters} selectFilter={onSelectFilter} />
      </HStack>
      <Button size={'small'} onClick={resetFilterAll} className={styles.fjernButton}>
        Fjern alle filtre
      </Button>
    </VStack>
  )
}

const SeteSelect = ({
  filters,
  selectFilter,
}: {
  filters: { [_: string]: string[] }
  selectFilter: (name: string, value: string) => void
}) => {
  const searchParams = useSearchParams()
  return (
    <>
      {Object.entries(filters).map(([key, row], index) => {
        return (
          row.length > 0 && (
            <Select
              key={index + 1}
              label={key}
              onChange={(event) => selectFilter(key, event.target.value)}
              value={searchParams.get(key) ?? ''}
            >
              <option key="" value="">
                Velg
              </option>
              {row.map((value, i) => (
                <option key={i + 1}>{value}</option>
              ))}
            </Select>
          )
        )
      })}
    </>
  )
}
