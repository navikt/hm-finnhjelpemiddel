import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { Button, HStack } from '@navikt/ds-react'

import { FilterData } from '@/utils/api-util'

import { CheckboxFilter } from '@/components/filters/CheckboxFilter'
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
      className="agreement-page__filter-form"
    >
      <HStack gap="4" className="filter-container__filters filter-container__horizontal">
        <CheckboxFilter filter={{ key: 'delkontrakt', data: filters?.delkontrakt }} />
        <CheckboxFilter filter={{ key: 'leverandor', data: filters?.leverandor }} showSearch={true} />
      </HStack>

      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
      <input type="submit" style={{ display: 'none' }} />
    </form>
  )
})

export default FilterForm
