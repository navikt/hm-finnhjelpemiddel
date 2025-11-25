import { Button, Heading, HStack, VStack } from '@navikt/ds-react'
import { KategoriToggleFilter } from '@/app/kategori/KategoriToggleFilter'
import { CircleSlashIcon } from '@navikt/aksel-icons'
import { CheckboxFilterNew, FilterMenu } from '@/components/filters/CheckboxFilterNew'
import { MinMaxFilter, MinMaxMenu } from '@/app/kategori/MinMaxFilter'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useQueryString from '@/utils/search-params-util'

export type Filters = {
  ['suppliers']: string[]
  ['isos']: {
    key: string
    label: string
  }[]
}

type Props = {
  filters: Filters
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export const FilterBarKategori = ({ filters, onChange, onReset }: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { createQueryString } = useQueryString()
  const supplierFilters: FilterMenu = {
    name: { key: 'supplier', label: 'Leverandører' },
    options: filters.suppliers,
  }

  const minMaxFilters: MinMaxMenu = {
    name: { key: 'minMax', label: 'MinMax' },
    options: { minKey: 'setebreddeMinCM', maxKey: 'setebreddeMaksCM' },
  }
  const onChange2 = (key: string, value: string) => {
    const newSearchParams = createQueryString(key, value)
    console.log(newSearchParams)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <div>
        <Button variant={'danger'} size={'xsmall'} onClick={onReset} icon={<CircleSlashIcon />}>
          Nullstill filtere
        </Button>
      </div>
      <HStack gap="4">
        <CheckboxFilterNew filterMenu={supplierFilters} onChange={onChange} />
        <MinMaxFilter filterMenu={minMaxFilters} onChange={onChange2} />
        {filters.isos.length > 1 && (
          <KategoriToggleFilter searchParamKey={'iso'} filter={filters.isos} onChange={onChange} />
        )}
      </HStack>
    </VStack>
  )
}
