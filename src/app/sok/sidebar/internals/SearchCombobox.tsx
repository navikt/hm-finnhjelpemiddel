import { useMemo, useState } from 'react'

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
  const [selectedOption, setSelectedOption] = useState('')
  const { searchData } = useHydratedSearchStore()
  const debouncedSearchValue = useDebounce<string>(inputValue)

  const { data: suggestionData } = useSWR<SuggestionsResponse>(debouncedSearchValue, fetchSuggestions, {
    keepPreviousData: true,
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

  return (
    <UNSAFE_Combobox
      label="Skriv ett eller flere søkeord"
      options={searchData.hasAgreementsOnly ? suggestionsWithAgreementOnly : allSuggestionsSortedonAgreementValue}
      value={inputValue}
      selectedOptions={selectedOption ? [selectedOption] : []}
      clearButton={true}
      allowNewValues={false}
      toggleListButton={true}
      onKeyUpCapture={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          onSearch([selectedOption, inputValue].filter(Boolean).join(' '))
        }
      }}
      onClear={() => {
        setInputValue('')
      }}
      onChange={(event) => {
        event && setInputValue(event.target.value)
      }}
      onToggleSelected={(option, isSelected) => {
        if (isSelected) {
          setSelectedOption(option)
          onSearch(option)
        } else {
          setSelectedOption('')
          onSearch('')
        }
      }}
    />
  )
}

export default SearchCombobox
