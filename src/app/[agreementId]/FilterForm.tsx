import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { Button } from '@navikt/ds-react'

import { FilterData } from '@/utils/api-util'

import FilterView from '@/components/filters/FilterView'
import { FormSearchData } from '@/utils/search-state-util'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters?: FilterData
  setFocus?: () => void
  onSubmit: SubmitHandler<FormSearchData>
}

const FilterForm = forwardRef<HTMLFormElement, Props>(({ filters, setFocus, onSubmit }, ref) => {
  const formRef = useRef<HTMLFormElement>(null)
  const formMethods = useFormContext<FormSearchData>()

  useImperativeHandle(ref, () => formRef.current!)

  return (
    <form
      ref={formRef}
      role="search"
      onSubmit={formMethods.handleSubmit(onSubmit)}
      aria-controls="agreementSearchResults"
    >
      <FilterView filters={filters} />
      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default FilterForm
