import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { KategoriToggleFilter } from '@/app/kategori/filter/KategoriToggleFilter'
import { XMarkIcon } from '@navikt/aksel-icons'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'
import { MinMaxFilter } from '@/app/kategori/filter/MinMaxFilter'
import styles from './FilterBarKategori.module.scss'
import { MeasurementInfo } from '@/app/kategori/utils/kategori-inngang-util'
import { getIsoLabel } from '@/app/kategori/utils/mappings/isoLabelMapping'

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
  onChange: (key: string, value: string | string[]) => void
  onReset: () => void
}

export const FilterBarKategori = ({ filters, onChange, onReset }: Props) => {
  const supplierFilters: FilterMenu = {
    name: { key: 'suppliers', label: 'Leverandører', paramKey: 'leverandor' },
    options: filters.suppliers,
  }

  const isoFilters: FilterMenu = {
    name: { key: 'isos', label: 'Produktkategorier', paramKey: 'iso' },

    options: filters.isos.map((iso) => ({ value: iso.key, label: getIsoLabel(iso.key, iso.label)})),
  }

  return (
    <VStack gap={'space-16'}>
      <Heading level={'3'} size={'small'}>
        Filter
      </Heading>
      <HStack gap="space-8" maxWidth={'1214px'}>
        {filters.isos.length > 1 && <CheckboxFilterNew filterMenu={isoFilters} onChange={onChange} />}
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
