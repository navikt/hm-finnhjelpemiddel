'use client'

import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { XMarkIcon } from '@navikt/aksel-icons'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'
import { RangeFilter } from '@/app/kategori/filter/RangeFilter'
import styles from './FilterBarKategori.module.scss'
import { getIsoLabel } from '@/app/kategori/utils/mappings/isoLabelMapping'
import { useSearchParams } from 'next/navigation'
import { FilterFunctionType, TechDataFilterAggs } from '@/app/kategori/utils/kategori-types'
import { ToggleFilter, ToggleFilterMenu } from '@/app/kategori/filter/ToggleFilter'

export type Filters = {
  ['suppliers']: string[]
  ['digitalSoknad']: boolean[]
  ['bestillingsordning']: boolean[]
  ['isos']: {
    key: string
    label: string
  }[]
  ['techDataFilterAggs']?: TechDataFilterAggs
}

type Props = {
  filters: Filters
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export const FilterBarKategori = ({ filters, onChange, onReset }: Props) => {
  const searchParams = useSearchParams()

  const hasActiveFilter = Array.from(searchParams.keys()).filter((param) => param != 'page').length > 0

  const supplierFilters: FilterMenu = {
    name: { key: 'suppliers', label: 'Leverandør', paramKey: 'leverandor' },
    options: filters.suppliers.sort(),
  }

  const isoFilters: FilterMenu = {
    name: { key: 'isos', label: 'Kategori', paramKey: 'iso' },

    options: filters.isos
      .map((iso) => ({ value: iso.key, label: getIsoLabel(iso.key, iso.label) }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  }

  const digitalSoknadFilters: ToggleFilterMenu = {
    name: { key: 'På digital behovsmelding', label: 'Digital behovsmelding' },
    options: filters.digitalSoknad,
  }

  const bestillingsordningFilters: ToggleFilterMenu = {
    name: { key: 'På bestillingsordning', label: 'Bestillingsordning' },
    options: filters.bestillingsordning,
  }

  return (
    <VStack gap={'space-16'}>
      <Heading level={'3'} size={'small'}>
        Filter
      </Heading>
      <HStack gap="space-8" maxWidth={'1214px'}>
        {filters.isos.length > 1 && <CheckboxFilterNew filterMenu={isoFilters} onChange={onChange} />}
        <CheckboxFilterNew filterMenu={supplierFilters} onChange={onChange} />
        {filters.techDataFilterAggs &&
          Array.from(filters.techDataFilterAggs.entries()).map(([key, value]) => {
            const filter = value.filter

            if (filter.filterFunctionType === FilterFunctionType.range) {
              return <RangeFilter key={key} filterMenu={{ name: value.filter.fieldLabel, options: value }} />
            } else if (filter.filterFunctionType === FilterFunctionType.singleField) {
              const filterMenu = {
                name: { key: filter.searchParamName, label: filter.identifier, paramKey: filter.searchParamName },
                options: value.values.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
              }
              return <CheckboxFilterNew key={key} filterMenu={filterMenu} onChange={onChange} />
            }
          })}
        {hasActiveFilter && (
          <Button
            variant={'secondary'}
            size={'small'}
            onClick={onReset}
            className={styles.filterButton}
            data-color={'neutral'}
            icon={<XMarkIcon aria-hidden />}
            iconPosition={'right'}
          >
            Nullstill
          </Button>
        )}
      </HStack>
      <HStack gap="space-8" maxWidth={'1214px'}>
        <ToggleFilter filterMenu={digitalSoknadFilters} />
        <ToggleFilter filterMenu={bestillingsordningFilters} />
      </HStack>
    </VStack>
  )
}
