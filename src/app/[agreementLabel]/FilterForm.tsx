import { forwardRef, useRef } from 'react'
import { Controller, SubmitHandler, useFormContext } from 'react-hook-form'

import { Button } from '@navikt/ds-react'

import { FilterData } from '@/utils/api-util'

import { useSearchParams } from 'next/navigation'
import FilterView from '../sok/sidebar/FilterView'
import AutocompleteSearch from '../sok/sidebar/internals/AutocompleteSearch'
import { AgreementSearchData } from './AgreementSearch'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters?: FilterData
  setFocus?: () => void
  onSubmit: SubmitHandler<AgreementSearchData>
}

const FilterForm = forwardRef<HTMLFormElement, Props>(({ filters, setFocus, onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const formMethods = useFormContext<AgreementSearchData>()
  const searchParams = useSearchParams()
  const searchTerm = searchParams.get('term') ?? ''

  const onSearch = (searchTerm: string) => {
    formMethods.setValue('searchTerm', searchTerm)
    formRef.current?.requestSubmit()
  }

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      aria-controls="agreementSearchResults"
    >
      <div className="spacing-bottom--medium">
        <Controller
          name="searchTerm"
          control={formMethods.control}
          defaultValue=""
          render={() => <AutocompleteSearch onSearch={onSearch} initialValue={searchTerm} />}
        />
      </div>
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default FilterForm
