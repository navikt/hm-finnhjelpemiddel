'use client'

import { HGrid, Search } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import useQueryString from '@/utils/search-params-util'
import useSWRImmutable from 'swr/immutable'
import { FilterData, getFiltersAgreement } from '@/utils/api-util'
import { SupplierSelect } from '@/app/tjenester/SupplierSelect'

export const TjenesterSearchBar = ({ id, showSupplierSelect }: { id: string; showSupplierSelect?: boolean }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringMultiple, searchParamKeys } = useQueryString()

  const initialSearchTerm = searchParams.get(searchParamKeys.searchTerm) || ''
  const [inputValue, setInputValue] = useState(initialSearchTerm)

  const [currentSelectedSupplier, setCurrentSelectedSupplier] = useState<string>(
    searchParams.get(searchParamKeys.supplier) || ''
  )

  const { data: filtersFromData } = useSWRImmutable<FilterData>(
    showSupplierSelect ? { agreementId: id, type: 'filterdata' } : null,
    getFiltersAgreement,
    { keepPreviousData: true }
  )

  const pushSearch = (term: string) => {
    const trimmed = term.trim()

    if (trimmed === '') {
      // Empty term: reset search by navigating to the base pathname (no search term param)
      router.push(pathname, { scroll: false })
      return
    }

    const newParams = createQueryStringMultiple(
      { name: searchParamKeys.searchTerm, value: trimmed },
      { name: searchParamKeys.page, value: '1' }
    )
    router.push(`${pathname}?${newParams}`, { scroll: false })
  }

  const handleChange = (value: string) => {
    // Only update local state while typing
    setInputValue(value)

    // If the user clears the field by typing backspace to empty, also reset the search
    if (value === '') {
      router.push(pathname, { scroll: false })
    }
  }

  const handleClear = () => {
    setInputValue('')
    // Clear button: also reset search by going back to base pathname
    router.push(pathname, { scroll: false })
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      pushSearch(inputValue)
    }
  }

  return (
    <HGrid gap={{ xs: '3', md: '4' }} columns={{ xs: 1, md: 2 }} marginBlock="7 3" align="end">
      <Search
        value={inputValue}
        label="Søk"
        hideLabel={true}
        variant="primary"
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onClear={handleClear}
        placeholder={'Søk etter tjenester, HMS-nummer eller lev-artnr.'}
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
