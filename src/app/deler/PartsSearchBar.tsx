'use client'

import { HGrid, Search } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import useQueryString from '@/utils/search-params-util'
import useSWRImmutable from 'swr/immutable'
import { FilterData, getFiltersAgreement } from '@/utils/api-util'
import { SupplierSelect } from '@/app/deler/SupplierSelect'

export const PartsSearchBar = ({ id, showSupplierSelect }: { id: string; showSupplierSelect?: boolean }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringMultiple, searchParamKeys } = useQueryString()
  const searchTermValue = searchParams.get(searchParamKeys.searchTerm) || ''
  const [inputValue, setInputValue] = useState(searchTermValue)

  const [currentSelectedSupplier, setCurrentSelectedSupplier] = useState<string>(
    searchParams.get(searchParamKeys.supplier) || ''
  )
  const { data: filtersFromData } = useSWRImmutable<FilterData>(
    showSupplierSelect ? { agreementId: id, type: 'filterdata' } : null,
    getFiltersAgreement,
    {
      keepPreviousData: true,
    }
  )

  const onSearch = () => {
    const newParams = createQueryStringMultiple(
      { name: searchParamKeys.searchTerm, value: inputValue },
      { name: searchParamKeys.page, value: '1' }
    )

    router.replace(`${pathname}?${newParams}`, { scroll: false })
  }

  const onClear = () => {
    setInputValue('')
    router.replace(`${pathname}`, { scroll: false })
  }

  return (
    <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} marginBlock="7 3" align="end">
      <Search
        defaultValue={inputValue}
        label="Søk"
        hideLabel={true}
        variant="primary"
        onChange={setInputValue}
        onKeyUp={onSearch}
        onClear={onClear}
      />
      {showSupplierSelect && (
        <SupplierSelect
          supplierNames={filtersFromData && filtersFromData.leverandor.values}
          selectChange={setCurrentSelectedSupplier}
          selectedValue={currentSelectedSupplier ?? ''}
        />
      )}
    </HGrid>
  )
}
