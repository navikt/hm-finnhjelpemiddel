import { useEffect, useMemo, useState } from 'react'

import useSWR from 'swr'

import { UNSAFE_Combobox } from '@navikt/ds-react'

import { SuggestionsResponse, fetchSuggestions } from '@/utils/api-util'

import useDebounce from '@/hooks/useDebounce'
import { useSearchParams } from 'next/navigation'

type Props = {
  initialValue: string
  onSearch(searchTerm: string): void
}

const SearchCombobox = ({ initialValue, onSearch }: Props) => {
  const [inputValue, setInputValue] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const debouncedSearchValue = useDebounce<string>(inputValue)
  const [isListOpen, setListIsopen] = useState(false)
  const searchParams = useSearchParams()

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
    if (!searchParams.has('term')) {
      setInputValue('')
      setSelectedOptions([])
    }
  }, [searchParams])

  useEffect(() => {
    if (inputValue) setListIsopen(true)
    else setListIsopen(false)
  }, [inputValue])

  const onToggleSelected = (option: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedOptions([option])
      setListIsopen(false)
      onSearch(option)
    } else {
      setSelectedOptions([])
      onSearch('')
    }
  }

  const options = searchParams.has('agreement') ? suggestionsWithAgreementOnly : allSuggestionsSortedonAgreementValue

  return (
    <UNSAFE_Combobox
      label="Skriv ett eller flere søkeord"
      isMultiSelect={false}
      onChange={(event) => {
        if (!selectedOptions.length) {
          setInputValue(event?.target.value || '')
        }
      }}
      onToggleSelected={onToggleSelected}
      selectedOptions={selectedOptions}
      options={options}
      value={inputValue}
      clearButton={true}
      isListOpen={isListOpen}
      toggleListButton={false}
      onKeyUpCapture={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          setSelectedOptions([inputValue])
          onSearch(inputValue)
          setInputValue('')
          setListIsopen(false)
        }
      }}
    />
  )
}

export default SearchCombobox
