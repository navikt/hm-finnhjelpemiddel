import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { Button } from '@navikt/ds-react'

import { FilterData, SearchData, SelectedFilters } from '@/utils/api-util'

import FilterView from '@/components/filters/FilterView'
import { mapPostTitle } from '@/utils/agreement-util'
import { FilterCategories } from '@/utils/filter-util'
import { Entries } from '@/utils/type-util'
import { useSearchParams } from 'next/navigation'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters?: FilterData
  selectedFilters?: SelectedFilters
  setFocus?: () => void
  onSubmit: SubmitHandler<SearchData>
}

const FilterForm = forwardRef<HTMLFormElement, Props>(({ filters, selectedFilters, setFocus, onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()
  // const searchTerm = searchParams.get('term') ?? ''

  useImperativeHandle(ref, () => formRef.current!)

  const onSearch = (searchTerm: string) => {
    formMethods.setValue('searchTerm', searchTerm)
    formRef.current?.requestSubmit()
  }

  const filterValues = selectedFilters
    ? Object.values(selectedFilters)
        .flat()
        .filter((val) => val)
    : []

  const filterChips = selectedFilters
    ? (Object.entries(selectedFilters) as Entries<SelectedFilters>).flatMap(([key, values]) => ({
        key,
        values,
        label: FilterCategories[key],
      }))
    : []

  const makeLabel = (label: FilterCategories, value: any): string => {
    if (label === FilterCategories.leverandor) {
      return value
    }
    if (label === FilterCategories.delkontrakt) {
      return mapPostTitle(value)
    } else {
      return `${label}: ${value}`
    }
  }

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      aria-controls="agreementSearchResults"
    >
      {/* <div className="spacing-bottom--medium">
          <Controller
            name="searchTerm"
            control={formMethods.control}
            defaultValue=""
            render={() => (
              <AutocompleteSearch onSearch={onSearch} initialValue={searchTerm} agreementId={agreementId} />
            )}
          />
        </div> */}

      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default FilterForm
