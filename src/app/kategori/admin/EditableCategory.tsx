'use client'

import { Chips, Skeleton, Switch, Textarea, TextField, UNSAFE_Combobox, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { Category, CategoryDTO, getCategories } from '@/app/kategori/admin/category-admin-util'
import useSWR from 'swr'

export const EditableCategory = ({
  inputValue,
  setInputValue,
  id,
}: {
  inputValue: Category
  setInputValue: (value: Category) => void
  id?: string
}) => {
  const [isoFieldValue, setIsoFieldValue] = useState('')
  const { data: categories, isLoading, error } = useSWR<CategoryDTO[]>('categories', () => getCategories())

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

      {isLoading || !categories ? (
        <Skeleton />
      ) : (
        <SubCategoriesModule categories={categories} inputValue={inputValue} setInputValue={setInputValue} id={id} />
      )}

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

type Options = {
  label: string
  value: string
}

const SubCategoriesModule = ({
  categories,
  inputValue,
  setInputValue,
  id = '',
}: {
  categories: CategoryDTO[]
  inputValue: Category
  setInputValue: (value: Category) => void
  id?: string
}) => {
  const options: Options[] =
    categories
      ?.filter((category) => category.id != id)
      .map((category) => ({
        label: category.data.name,
        value: category.id,
      })) ?? []

  const [selectedOptions, setSelectedOptions] = useState<Options[]>(
    options.filter((option) => inputValue.subCategories.includes(option.value))
  )

  const chipRef = useRef(null)

  const addSubCategory = (optionValue: string) => {
    const newSelected = [...selectedOptions, options.filter((option) => option.value === optionValue)[0]]
    setSelectedOptions(newSelected)
    setInputValue({ ...inputValue, subCategories: newSelected.flatMap((option) => option.value) })
  }
  const removeSubCategory = (optionValue: string) => {
    const newSelected = selectedOptions.filter((o) => o.value !== optionValue)
    setSelectedOptions(newSelected)
    setInputValue({ ...inputValue, subCategories: newSelected.flatMap((option) => option.value) })
  }

  return (
    <UNSAFE_Combobox
      label={'Underkategorier'}
      isMultiSelect
      shouldAutocomplete
      options={options}
      selectedOptions={selectedOptions}
      onToggleSelected={(option, isSelected) => (isSelected ? addSubCategory(option) : removeSubCategory(option))}
    />
  )
}
