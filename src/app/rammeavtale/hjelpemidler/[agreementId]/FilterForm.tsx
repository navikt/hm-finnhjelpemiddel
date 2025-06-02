import { forwardRef, useImperativeHandle, useRef } from 'react'
import { SubmitHandler, useFormContext } from 'react-hook-form'

import { Button, Heading, HStack, VStack } from '@navikt/ds-react'

import { FilterData } from '@/utils/api-util'

import { CheckboxFilter } from '@/components/filters/CheckboxFilter'
import { FormSearchData } from '@/utils/search-state-util'
import { CheckboxFilterNew } from '@/components/filters/CheckboxFilterNew'

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
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <form
        ref={formRef}
        role="search"
        onSubmit={formMethods.handleSubmit(onSubmit)}
        aria-controls="agreementSearchResults"
        className="agreement-page__filter-form"
      >
        <HStack gap="4" className="filter-container__filters filter-container__horizontal">
          <CheckboxFilterNew filter={{ key: 'delkontrakt', data: filters?.delkontrakt }} name={'Delkontrakt'} />
          <CheckboxFilterNew filter={{ key: 'delkontrakt', data: filters?.leverandor }} name={'Leverandør'} />
        </HStack>

        {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
        <input type="submit" style={{ display: 'none' }} />
      </form>
    </VStack>
  )
})

export default FilterForm
