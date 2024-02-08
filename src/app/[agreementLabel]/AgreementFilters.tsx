import { CheckboxFilterInput } from '@/components/filters/CheckboxFilterInput'
import { FilterData } from '@/utils/api-util'
import { mapProductSearchParams } from '@/utils/product-util'
import { BodyShort } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

const AgreementFilters = ({ filters }: { filters?: FilterData }) => {
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapProductSearchParams(searchParams), [searchParams])

  const searchDataFilters = Object.entries(searchData.filters)
    .filter(([_, values]) => values.some((value) => !(value === null || value === undefined)))
    .reduce((newList, [key]) => [...newList, key], [] as Array<string>)

  const noAvailableFilters =
    !filters || !Object.values(filters).filter((data) => data.values.length).length || !Object.keys(filters).length

  if (!searchDataFilters.length && noAvailableFilters) {
    return (
      <div className="search__filters">
        <BodyShort>Ingen filtre tilgjengelig</BodyShort>
      </div>
    )
  }

  return (
    <div className="search__filters">
      <CheckboxFilterInput filter={{ key: 'beregnetBarn', data: filters?.beregnetBarn }} />
      <CheckboxFilterInput filter={{ key: 'leverandor', data: filters?.leverandor }} />
    </div>
  )
}

export default AgreementFilters
