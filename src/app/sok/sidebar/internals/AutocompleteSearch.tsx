'use client'

import { useEffect, useRef, useState } from 'react'

import useSWR from 'swr'

import { Popover } from '@navikt/ds-react'
import { Search } from '../../../../components/@navikt/ds-react/form/search' // copy from node_modules/@navikt

import { Suggestions, fetchSuggestions } from '@/utils/api-util'

import useDebounce from '@/hooks/useDebounce'
import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import useVirtualFocus from '@/hooks/useVirtualFocus'

type Props = {
  onSearch: (searchTerm: string) => void
  initialValue?: string
}

const AutocompleteSearch = ({ onSearch, initialValue }: Props) => {
  const [openState, setOpenState] = useState(false)
  const [inputValue, setInputValue] = useState(initialValue || '')
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
    if (inputValue && !selectedOption && !initialValue) {
      setOpenState(true)
    } else setOpenState(false)
  }, [inputValue, selectedOption, initialValue])

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
      if (!inputValue.length) {
        setSelectedOption('')
        onSearch('')
        setOpenState(false)
      } else {
        setShouldFetch(true)
        setOpenState(true)
      }
    }
  }

  return (
    <div className="search-wrapper">
      <Search
        value={inputValue}
        type="search"
        ref={searchFieldRef}
        label="Skriv ett eller flere søkeord"
        hideLabel={false}
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
