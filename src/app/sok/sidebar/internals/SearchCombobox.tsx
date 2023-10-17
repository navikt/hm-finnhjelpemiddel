import { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'

import { UNSAFE_Combobox } from '@navikt/ds-react'

import { SuggestionsResponse, fetchSuggestions } from '@/utils/api-util'
import { useHydratedSearchStore } from '@/utils/search-state-util'

import useDebounce from '@/hooks/useDebounce'

type Props = {
  initialValue: string
  onSearch(searchTerm: string): void
}

const SearchCombobox = ({ initialValue, onSearch }: Props) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([initialValue])
  const { searchData } = useHydratedSearchStore()
  const debouncedSearchValue = useDebounce<string>(inputValue, 200)

  const { data: suggestionData } = useSWR<SuggestionsResponse>(debouncedSearchValue, fetchSuggestions, {
    keepPreviousData: false,
  })

  //hasAgreementOnly === true comes first.
  const allSuggestionsSortedonAgreementValue = useMemo(
    () =>
      suggestionData?.suggestions
        .map((suggestion) => suggestion)
        .sort((a, b) => (b.data.hasAgreement === a.data.hasAgreement ? 0 : a ? -1 : 1))
        .map((suggestion) => suggestion.text) || [],
    [suggestionData]
  )

  const suggestionsWithAgreementOnly = useMemo(
    () =>
      suggestionData?.suggestions
        .filter((suggestion) => suggestion.data.hasAgreement === true)
        .map((suggestion) => suggestion.text) || [],
    [suggestionData]
  )

  useEffect(() => {
    if (!searchData.searchTerm) {
      setInputValue('')
      setSelectedOptions([])
    }
  }, [searchData.searchTerm])

  const onToggleSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOptions([option])
      onSearch(option)
    } else {
      setSelectedOptions([])
      onSearch('')
    }
  }

  console.log(selectedOptions)

  return (
    <UNSAFE_Combobox
      label="Skriv ett eller flere søkeord"
      isMultiSelect={false}
      onChange={(event) => setInputValue(event?.target.value || '')}
      onToggleSelected={onToggleSelected}
      selectedOptions={selectedOptions}
      options={searchData.hasAgreementsOnly ? suggestionsWithAgreementOnly : allSuggestionsSortedonAgreementValue}
      value={inputValue}
      allowNewValues
      onKeyUpCapture={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onSearch(inputValue)
        }
      }}
    />
  )
}

export default SearchCombobox
