'use client'

import { Chips, Switch, Textarea, TextField, UNSAFE_Combobox, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { Category, CategoryDTO, getCategories } from '@/app/kategori/admin/category-admin-util'
import useSWR from 'swr'

type Options = {
  label: string
  value: string
}

export const EditableCategory = ({
  inputValue,
  setInputValue,
}: {
  inputValue: Category
  setInputValue: (value: Category) => void
}) => {
  const [isoFieldValue, setIsoFieldValue] = useState('')

  return (
    <VStack gap={'4'} maxWidth={'300px'}>
      <TextField
        label="Tittel"
        defaultValue={inputValue.name}
        onChange={(event) => setInputValue({ ...inputValue, name: event.currentTarget.value })}
      />
      <Textarea
        label={'Beskrivelse'}
        defaultValue={inputValue.description}
        onChange={(event) => setInputValue({ ...inputValue, description: event.currentTarget.value })}
      />

      <SubCategoriesModule inputValue={inputValue} setInputValue={setInputValue} />

      <div>
        <Chips>
          {inputValue.isos?.map((iso) => (
            <Chips.Removable
              key={iso + '-chip'}
              onClick={(event) =>
                setInputValue({
                  ...inputValue,
                  isos: [...inputValue.isos.filter((iso) => iso === event.currentTarget.value)],
                })
              }
            >
              {iso}
            </Chips.Removable>
          ))}
        </Chips>
        <TextField
          label={'ISO-er'}
          value={isoFieldValue}
          onChange={(event) => setIsoFieldValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              setInputValue({ ...inputValue, isos: [...(inputValue?.isos ?? []), event.currentTarget.value] })
              setIsoFieldValue('')
            }
          }}
        />
      </div>

      <Switch
        checked={inputValue.showProducts}
        onChange={(event) => setInputValue({ ...inputValue, showProducts: event.currentTarget.checked })}
      >
        Vis produkter
      </Switch>
    </VStack>
  )
}

const SubCategoriesModule = ({
  inputValue,
  setInputValue,
}: {
  inputValue: Category
  setInputValue: (value: Category) => void
}) => {
  const { data: categories, isLoading, error } = useSWR<CategoryDTO[]>('categories', () => getCategories())

  const options: Options[] =
    categories?.map((category) => ({
      label: category.data.name,
      value: category.data.name,
    })) ?? []

  const [selectedOptions, setSelectedOptions] = useState<string[]>(inputValue.subCategories ?? [])

  const chipRef = useRef(null)

  const setSubCategories = (selectedOptions: string[]) => {
    setSelectedOptions(selectedOptions)
    setInputValue({ ...inputValue, subCategories: selectedOptions })
  }

  return (
    <UNSAFE_Combobox
      label={'Underkategorier'}
      isMultiSelect
      shouldAutocomplete
      isLoading={isLoading}
      options={options}
      selectedOptions={selectedOptions}
      onToggleSelected={(option, isSelected) =>
        isSelected
          ? setSubCategories([...selectedOptions, option])
          : setSubCategories(selectedOptions.filter((o) => o !== option))
      }
    />
  )
}
