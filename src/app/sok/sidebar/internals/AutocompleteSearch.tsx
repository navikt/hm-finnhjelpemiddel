'use client'

import { RefObject, useEffect, useRef, useState } from 'react'

import useSWR from 'swr'

import { Popover, Search } from '@navikt/ds-react'

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
  const virtualFocus = useVirtualFocus(listContainerRef.current, suggestions)

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
    console.log(virtualFocus.activeElementData)
    console.log(virtualFocus.activeElement)
    const buttonElm = virtualFocus.activeElement?.firstChild as HTMLButtonElement
    buttonElm?.focus()
  }, [virtualFocus.activeElement, virtualFocus.activeElementData])

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

  const handlesearchWordSelected = () => {
    if (inputValue) {
      setShouldFetch(false)
      setSelectedOption(inputValue)
      formMethods.setValue('searchTerm', inputValue)
      formRef.current?.requestSubmit()
      setOpenState(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()

      if (event.key === 'ArrowUp') {
        if (virtualFocus.isFocusOnTheTop) {
          searchFieldRef.current?.focus()
        } else {
          virtualFocus.moveFocusUp()
        }
      } else if (event.key === 'ArrowDown') {
        virtualFocus.moveFocusDown()
      }
    }
  }

  //Trenger ikke å legge til classname active når knappen får fokus og kan styles med &:focus
  //className={virtualFocus.activeElementData == suggestion ? 'active' : ''}

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
            variant="simple"
            ref={searchFieldRef}
            label="Skriv ett eller flere søkeord"
            hideLabel={false}
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
            onKeyUpCapture={(event) => {
              if (event.key === 'Enter') {
                formMethods.setValue('searchTerm', event.currentTarget.value)
                formRef.current?.requestSubmit()
                setOpenState(false)
              }
              if (event.key === 'Backspace' && !inputValue) {
                formMethods.setValue('searchTerm', '')
                formRef.current?.requestSubmit()
                setOpenState(false)
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                listContainerRef.current?.focus()
              }
            }}
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
          <ul onKeyDown={handleKeyDown} role="listbox" className="popover-list" ref={listContainerRef} tabIndex={0}>
            {(suggestions || []).map((suggestion, i) => (
              <li key={i}>
                <button
                  tabIndex={0}
                  className="reset-button-styling"
                  onClick={handleSelectedOption}
                  data-value={suggestion.text}
                  type="button"
                >
                  {suggestion.text}
                </button>
              </li>
            ))}

            {!selectedOption && (
              <>
                <div className="divider" data-no-focus="true" />
                <li className="popover-search-word">
                  <button className="reset-button-styling" onClick={handlesearchWordSelected} type="button">
                    <MagnifyingGlassIcon title="søkeikon" fontSize="1.5rem" />
                    <span>{`Søk på "${inputValue}" i hele databasen`}</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </Popover.Content>
      </Popover>
    </div>
  )
}

export default AutocompleteSearch
