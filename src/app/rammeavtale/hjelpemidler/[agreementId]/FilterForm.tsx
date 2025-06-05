import { Button, Heading, HStack, VStack } from '@navikt/ds-react'

import { FilterData } from '@/utils/api-util'
import { CheckboxFilterNew } from '@/components/filters/CheckboxFilterNew'

const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => (
  <Button className="visually-hidden-focusable" variant="secondary" size="small" type="button" onClick={setFocus}>
    Gå til resultat
  </Button>
)

type Props = {
  filters: FilterData
  onChange: (key: string, value: string) => void
  setFocus?: () => void
}

const FilterForm = ({ filters, setFocus, onChange }: Props) => {
  console.log('filters', filters)
  const delkontraktFilterData = filters?.delkontrakt
    ? filters?.delkontrakt.values.map((value) => (value.key ? value.key.toString() : ''))
    : []
  const leverandorFilterData = filters?.leverandor
    ? filters?.leverandor.values.map((value) => (value.key ? value.key.toString() : ''))
    : []

  return (
    <VStack gap={'4'}>
      <Heading size={'small'}>Filter</Heading>
      <HStack gap="4" className="filter-container__filters filter-container__horizontal">
        <CheckboxFilterNew filter={{ key: 'delkontrakt', data: delkontraktFilterData }} onChange={onChange} />
        <CheckboxFilterNew filter={{ key: 'leverandor', data: leverandorFilterData }} onChange={onChange} />
      </HStack>

      {setFocus && <FocusOnResultsButton setFocus={setFocus} />}
    </VStack>
  )
}

export default FilterForm
