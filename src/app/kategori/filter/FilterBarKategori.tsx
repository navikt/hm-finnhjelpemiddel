import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { XMarkIcon } from '@navikt/aksel-icons'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'
import { MinMaxFilter } from '@/app/kategori/filter/MinMaxFilter'
import styles from './FilterBarKategori.module.scss'
import { FilterDataType, TechDataFilterAggs } from '@/app/kategori/utils/kategori-inngang-util'
import { getIsoLabel } from '@/app/kategori/utils/mappings/isoLabelMapping'

export type Filters = {
  ['suppliers']: string[]
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
  const supplierFilters: FilterMenu = {
    name: { key: 'suppliers', label: 'Leverandører', paramKey: 'leverandor' },
    options: filters.suppliers,
  }

  const isoFilters: FilterMenu = {
    name: { key: 'isos', label: 'Produktkategorier', paramKey: 'iso' },

    options: filters.isos.map((iso) => ({ value: iso.key, label: getIsoLabel(iso.key, iso.label) })),
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
          filters.techDataFilterAggs.entries().map(([key, value]) => {
            const filter = value.filter

            if (filter.filterDataType === FilterDataType.minMax) {
              return <MinMaxFilter key={key} filterMenu={{ name: key, options: value }} />
            } else if (filter.filterDataType === FilterDataType.singleField) {
              const filterMenu = {
                name: { key: filter.searchParamName, label: filter.fieldName, paramKey: filter.searchParamName },
                options: value.values.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
              }
              return <CheckboxFilterNew key={key} filterMenu={filterMenu} onChange={onChange} />
            }
          })}
        <div>
          <Button
            variant={'secondary'}
            size={'small'}
            onClick={onReset}
            className={styles.filterButton}
            data-color={'danger'}
            icon={<XMarkIcon aria-hidden />}
            iconPosition={'right'}
          >
            Nullstill
          </Button>
        </div>
      </HStack>
    </VStack>
  )
}
