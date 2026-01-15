'use client'

import {
  BodyShort,
  Chips,
  Popover,
  Skeleton,
  Switch,
  Textarea,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from '@navikt/ds-react'
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

      <VStack gap={'2'}>
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
      </VStack>

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
    <VStack gap={'2'}>
      <UNSAFE_Combobox
        label={'Underkategorier'}
        isMultiSelect
        shouldAutocomplete
        shouldShowSelectedOptions={false}
        options={options}
        selectedOptions={selectedOptions}
        onToggleSelected={(option, isSelected) => (isSelected ? addSubCategory(option) : removeSubCategory(option))}
      />
      <Chips>
        {selectedOptions?.map((option) => (
          <ChipsPopover
            key={option.value + '-chip'}
            option={option}
            removeSubCategory={removeSubCategory}
            categories={categories}
          />
        ))}
      </Chips>
    </VStack>
  )
}

const ChipsPopover = ({
  option,
  removeSubCategory,
  categories,
}: {
  option: Options
  removeSubCategory: (val: string) => void
  categories: CategoryDTO[]
}) => {
  const chipRef = useRef<HTMLButtonElement>(null)
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const category = categories.find((cat) => cat.id === option.value)!.data
  return (
    <>
      <Chips.Removable
        ref={chipRef}
        onClick={() => {
          removeSubCategory(option.value)
        }}
        onMouseOver={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
      >
        {option.label}
      </Chips.Removable>
      <Popover anchorEl={chipRef.current} open={popoverOpen} onClose={() => setPopoverOpen(false)}>
        <Popover.Content>
          <VStack gap={'2'} width={'400px'}>
            <BodyShort weight={'semibold'}>{category.name}</BodyShort>
            <BodyShort>{category.description}</BodyShort>
            {category.subCategories.length > 0 && (
              <BodyShort>
                Underkategorier:{' '}
                {categories
                  .filter((cat) => category.subCategories.includes(cat.id))
                  .map((val) => val.data.name)
                  .toString()}
              </BodyShort>
            )}
            {category.isos.length > 0 && <BodyShort>Iso-er: {category.isos.toString()}</BodyShort>}
          </VStack>
        </Popover.Content>
      </Popover>
    </>
  )
}
