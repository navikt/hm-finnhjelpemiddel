import { FilterData } from '@/utils/api-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { BodyShort, Heading, VStack } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { KategoriCheckboxFilter } from '@/app/kategori/bevegelse/manuelle-rullestoler/KategoriCheckboxFilter'

const KategoriFilterView = ({ filters }: { filters?: FilterData }) => {
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, value]) => value.length)
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const noAvailableFilters =
    !filters || !Object.values(filters).filter((data) => data.values?.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="filter-container__filters">
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  return (
    <VStack>
      <Heading size="small" level="2">
        Filter
      </Heading>
      <VStack gap="2" className="filter-container__filters spacing-vertical--small">
        <KategoriCheckboxFilter
          filter={{ key: 'vis', data: filters?.vis }}
          openByDefault={true}
        ></KategoriCheckboxFilter>
        {/* <CheckboxFilter filter={{ key: 'categories', data: filters?.category }} openByDefault={true}></CheckboxFilter> */}
        <KategoriCheckboxFilter filter={{ key: 'produktkategori', data: filters?.produktkategori }} showSearch={true} />
        <KategoriCheckboxFilter filter={{ key: 'rammeavtale', data: filters?.rammeavtale }} showSearch={true} />

        <KategoriCheckboxFilter filter={{ key: 'delkontrakt', data: filters?.delkontrakt }} />
        <KategoriCheckboxFilter filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
        <KategoriCheckboxFilter filter={{ key: 'fyllmateriale', data: filters?.fyllmateriale }} showSearch={true} />
        <KategoriCheckboxFilter filter={{ key: 'materialeTrekk', data: filters?.materialeTrekk }} showSearch={true} />
        <KategoriCheckboxFilter filter={{ key: 'leverandor', data: filters?.leverandor }} showSearch={true} />
      </VStack>
    </VStack>
  )
}

export default KategoriFilterView
