'use client'

import { RefObject, useEffect, useRef, useState } from 'react'

import useSWR from 'swr'

import { Popover } from '@navikt/ds-react'
import { Search } from '../../../../components/@navikt/ds-react/form/search' // copy from node_modules/@navikt

import { SearchData, Suggestions, fetchSuggestions } from '@/utils/api-util'
import { Controller, useFormContext } from 'react-hook-form'

import useDebounce from '@/hooks/useDebounce'
import { MagnifyingGlassIcon } from '@navikt/aksel-icons'
import useVirtualFocus from '@/hooks/useVirtualFocus'

type Props = {
  formRef: RefObject<HTMLFormElement>
}

const AutocompleteSearch = ({ formRef }: Props) => {
  const [openState, setOpenState] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [shouldFetch, setShouldFetch] = useState(true)
  const [selectedOption, setSelectedOption] = useState('')

  const searchFieldRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const listContainerRef = useRef<HTMLUListElement | null>(null)

  const formMethods = useFormContext<SearchData>()
  const debouncedSearchValue = useDebounce<string>(inputValue, 100)
  const { data: suggestions } = useSWR<Suggestions>(shouldFetch ? debouncedSearchValue : null, fetchSuggestions, {
    keepPreviousData: false,
  })
  const virtualFocus = useVirtualFocus(listContainerRef.current)

  useEffect(() => {
    if (inputValue && !selectedOption) {
      setOpenState(true)
    } else setOpenState(false)
  }, [inputValue, selectedOption])

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
      formMethods.setValue('searchTerm', searchWord)
      formRef.current?.requestSubmit()
      setOpenState(false)
    }
  }

  const handleSelectInputValue = () => {
    if (inputValue) {
      setShouldFetch(false)
      setSelectedOption(inputValue)
      formMethods.setValue('searchTerm', inputValue)
      formRef.current?.requestSubmit()
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
      formMethods.setValue('searchTerm', inputValue)
      formRef.current?.requestSubmit()
      setOpenState(false)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      const current = listContainerRef.current?.querySelector('li') as HTMLLIElement
      if (current) {
        virtualFocus.moveFocusToElement(current)
      }
    } else if (event.key === 'Backspace' && !inputValue.length) {
      event.preventDefault()
      setSelectedOption('')
      formMethods.setValue('searchTerm', '')
      formRef.current?.requestSubmit()
      setOpenState(false)
    }
  }

  return (
    <div className="search-wrapper">
      <Controller
        name="searchTerm"
        control={formMethods.control}
        defaultValue=""
        render={({ field }) => (
          <Search
            {...field}
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
              formMethods.setValue('searchTerm', searchTerm)
              formRef.current?.requestSubmit()
            }}
            onClear={() => {
              setSelectedOption('')
              formMethods.setValue('searchTerm', '')
              formRef.current?.requestSubmit()
            }}
            onKeyUp={handleKeyUpInInputField}
            onFocus={() => virtualFocus.reset()}
          />
        )}
      />

      <Popover
        open={openState}
        className="popover"
        placement="bottom"
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
