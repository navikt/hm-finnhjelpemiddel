import { useMemo, useState } from 'react'

import useSWR from 'swr'

import { UNSAFE_Combobox } from '@navikt/ds-react'

import { SuggestionsResponse, fetchSuggestions } from '@/utils/api-util'

type Props = {
  initialValue: string
  onSearch(searchTerm: string): void
}

const SearchCombobox = ({ initialValue, onSearch }: Props) => {
  const [inputValue, setInputValue] = useState(initialValue)
  const [selectedOption, setSelectedOption] = useState('')

  const { data: suggestionData } = useSWR<SuggestionsResponse>(inputValue, fetchSuggestions, {
    keepPreviousData: true,
  })

  const suggestions = useMemo(
    () => suggestionData?.suggestions.map((suggestion) => suggestion.text) || [],
    [suggestionData]
  )

  return (
    <UNSAFE_Combobox
      label="Skriv ett eller flere søkeord"
      options={suggestions}
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
        setInputValue(event.target.value)
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
