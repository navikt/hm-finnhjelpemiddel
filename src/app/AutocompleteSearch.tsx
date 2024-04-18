'use client'

import { useEffect, useRef, useState } from 'react'

import useSWR from 'swr'

import { Popover, Search } from '@navikt/ds-react'

import useDebounce from '@/hooks/useDebounce'
import useVirtualFocus from '@/hooks/useVirtualFocus'
import { Suggestions, fetchSuggestions } from '@/utils/api-util'
import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import { useSearchParams } from 'next/navigation'

type Props = {
  onSearch: (searchTerm: string) => void
}

const AutocompleteSearch = ({ onSearch }: Props) => {
  const [openState, setOpenState] = useState(false)
  const searchParams = useSearchParams()
  const searchParamValue = searchParams.get('term')
  const [inputValue, setInputValue] = useState(searchParamValue ?? '')
  const [shouldFetch, setShouldFetch] = useState(true)
  const [selectedOption, setSelectedOption] = useState('')

  const searchFieldRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const listContainerRef = useRef<HTMLUListElement | null>(null)

  const debouncedSearchValue = useDebounce<string>(inputValue, 100)
  const { data: suggestions } = useSWR<Suggestions>(shouldFetch ? debouncedSearchValue : null, fetchSuggestions, {
    keepPreviousData: false,
  })
  const virtualFocus = useVirtualFocus(listContainerRef.current)

  useEffect(() => {
    if (!searchParamValue) {
      setInputValue('')
    } else {
      setInputValue(searchParamValue)
    }
  }, [searchParamValue])

  useEffect(() => {
    if (inputValue && !selectedOption && !searchParamValue) {
      setOpenState(true)
    } else setOpenState(false)
  }, [inputValue, selectedOption, searchParamValue])

  useEffect(() => {
    if (selectedOption) setShouldFetch(false)
    else setShouldFetch(true)
  }, [selectedOption])

  useEffect(() => {
    virtualFocus.activeElement?.querySelector('button')?.focus()
  }, [virtualFocus.activeElement])

  const handleSelectedOption = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const searchWord = event.currentTarget.getAttribute('data-value')
    if (searchWord) {
      setShouldFetch(false)
      setSelectedOption(searchWord)
      setInputValue(searchWord)
      onSearch(searchWord)
      setOpenState(false)
    }
  }

  const handleSelectInputValue = () => {
    if (inputValue) {
      setShouldFetch(false)
      setSelectedOption(inputValue)
      onSearch(inputValue)
      setOpenState(false)
    }
  }

  const handleKeyDownInsideSuggestionList = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()

      if (event.key === 'ArrowUp') {
        if (virtualFocus.isFocusOnTheTop) {
          virtualFocus.reset()
          searchFieldRef.current?.focus()
        } else {
          virtualFocus.moveFocusUp()
        }
      } else if (event.key === 'ArrowDown') {
        virtualFocus.moveFocusDown()
      }
    }
  }

  const handleKeyUpInInputField = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const inputValue = (event.currentTarget as HTMLInputElement).value
      onSearch(inputValue)
      setOpenState(false)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const current = listContainerRef.current?.querySelector('li') as HTMLLIElement
      if (current) {
        virtualFocus.moveFocusToElement(current)
      }
    } else if (event.key === 'Backspace') {
      event.preventDefault()
      setShouldFetch(true)
      setOpenState(true)
    }
  }

  return (
    <div className="search-wrapper">
      <Search
        value={inputValue}
        ref={searchFieldRef}
        label="Skriv ett eller flere søkeord"
        variant="simple"
        hideLabel={true}
        size="medium"
        role="combobox"
        aria-expanded={openState}
        aria-controls={'suggestion-list'}
        aria-autocomplete="list"
        onChange={(value) => {
          setInputValue(value)
        }}
        onSearchClick={(searchTerm) => {
          onSearch(searchTerm)
        }}
        onClear={() => {
          setSelectedOption('')
          onSearch('')
        }}
        onKeyUp={handleKeyUpInInputField}
        onFocus={() => virtualFocus.reset()}
      />

      <Popover
        open={openState}
        className="popover"
        placement="bottom-start"
        onClose={() => setOpenState(false)}
        anchorEl={searchFieldRef.current}
        arrow={false}
        ref={popoverRef}
      >
        <Popover.Content className="popover-content">
          <ul
            aria-label="Søkeforslag"
            onKeyDown={handleKeyDownInsideSuggestionList}
            role="listbox"
            className="popover-list"
            ref={listContainerRef}
            id="suggestion-list"
          >
            {(suggestions || []).map((suggestion, i) => (
              <li key={i} id={suggestion.text}>
                <button tabIndex={0} onClick={handleSelectedOption} data-value={suggestion.text} type="button">
                  {suggestion.text}
                </button>
              </li>
            ))}

            {!selectedOption && (
              <li className="popover-search-word">
                <button className="reset-button-styling" onClick={handleSelectInputValue} type="button">
                  <MagnifyingGlassIcon title="søkeikon" fontSize="1.5rem" />
                  <span>{`Søk på "${inputValue}" i hele databasen`}</span>
                </button>
              </li>
            )}
          </ul>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default AutocompleteSearch
