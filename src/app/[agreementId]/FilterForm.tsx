import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { Button } from '@navikt/ds-react'

import { FilterData, SearchData, SelectedFilters } from '@/utils/api-util'

import FilterView from '@/components/filters/FilterView'
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

const FilterForm = forwardRef<HTMLFormElement, Props>(({ filters, setFocus, onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const formMethods = useFormContext<SearchData>()
  const searchParams = useSearchParams()
  // const searchTerm = searchParams.get('term') ?? ''

  useImperativeHandle(ref, () => formRef.current!)

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      aria-controls="agreementSearchResults"
    >
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}

      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default FilterForm
