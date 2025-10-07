// src/app/deler/PartsSearchBar.tsx
'use client'

import { HGrid, Search } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
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

  // Optional debounce (adjust delay or remove for immediate navigation)
  const debounceRef = useRef<number | null>(null)
  const DEBOUNCE_MS = 250

  useEffect(() => {
    if (searchTermValue !== inputValue) {
      setInputValue(searchTermValue)
    }
  }, [searchTermValue])

  const [currentSelectedSupplier, setCurrentSelectedSupplier] = useState<string>(
    searchParams.get(searchParamKeys.supplier) || ''
  )

  const { data: filtersFromData } = useSWRImmutable<FilterData>(
    showSupplierSelect ? { agreementId: id, type: 'filterdata' } : null,
    getFiltersAgreement,
    { keepPreviousData: true }
  )

  const pushSearch = (term: string) => {
    if (term.trim() === '') {
      router.push(pathname, { scroll: false })
      return
    }
    if (term === searchTermValue) return
    const newParams = createQueryStringMultiple(
      { name: searchParamKeys.searchTerm, value: term },
      { name: searchParamKeys.page, value: '1' }
    )
    router.push(`${pathname}?${newParams}`, { scroll: false })
  }

  const schedulePush = (value: string) => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => pushSearch(value), DEBOUNCE_MS)
  }

  const handleChange = (value: string) => {
    setInputValue(value)
    if (value === '') {
      if (searchTermValue !== '') router.push(pathname, { scroll: false })
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      return
    }
    schedulePush(value)
  }

  const handleClear = () => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    setInputValue('')
    router.push(pathname, { scroll: false })
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
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
