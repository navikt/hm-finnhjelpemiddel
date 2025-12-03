import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { KategoriToggleFilter } from '@/app/kategori/KategoriToggleFilter'
import { XMarkIcon } from '@navikt/aksel-icons'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'
import { MinMaxFilter } from '@/app/kategori/MinMaxFilter'
import styles from './FilterBarKategori.module.scss'
import { MeasurementInfo } from '@/app/kategori/utils/kategori-inngang-util'

export type Filters = {
  ['suppliers']: string[]
  ['isos']: {
    key: string
    label: string
  }[]
  ['measurementFilters']?: MeasurementInfo
}

type Props = {
  filters: Filters
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export const FilterBarKategori = ({ filters, onChange, onReset }: Props) => {
  const supplierFilters: FilterMenu = {
    name: { key: 'supplier', label: 'Leverandører' },
    options: filters.suppliers,
  }

  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="2" maxWidth={'1214px'}>
        {filters.isos.length > 1 && (
          <KategoriToggleFilter searchParamKey={'iso'} filter={filters.isos} onChange={onChange} />
        )}
        <CheckboxFilterNew filterMenu={supplierFilters} onChange={onChange} />
        {filters.measurementFilters &&
          Object.entries(filters.measurementFilters).map(([key, value]) => (
            <MinMaxFilter key={key} filterMenu={{ name: key, options: value }} />
          ))}
        <div>
          <Button
            variant={'secondary'}
            size={'small'}
            onClick={onReset}
            className={styles.filterButton}
            icon={<XMarkIcon />}
            iconPosition={'right'}
          >
            Nullstill
          </Button>
        </div>
      </HStack>
    </VStack>
  )
}
