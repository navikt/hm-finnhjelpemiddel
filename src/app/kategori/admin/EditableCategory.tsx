'use client'

import {
  CategoryAdminDTO,
  EditableCategoryDTO,
  getCategories,
  uppercaseCategoryTitle,
} from '@/app/kategori/admin/category-admin-util'

import { useRef, useState } from 'react'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'

import Image from 'next/image'
import NextLink from 'next/link'

import useSWR from 'swr'

import { MenuGridIcon, PlusCircleIcon, XMarkIcon } from '@navikt/aksel-icons'
import {
  BodyShort,
  Box,
  Button,
  Chips,
  HStack,
  Link,
  Popover,
  Skeleton,
  Switch,
  TextField,
  Textarea,
  UNSAFE_Combobox,
  VStack,
} from '@navikt/ds-react'

import styles from './EditableCategory.module.scss'

export const EditableCategory = ({
  inputValue,
  setInputValue,
  id,
}: {
  inputValue: EditableCategoryDTO
  setInputValue: (value: EditableCategoryDTO) => void
  id?: string
}) => {
  const { data: categories, isLoading } = useSWR<CategoryAdminDTO[]>('categories', () => getCategories())

  return (
    <VStack gap={'space-16'} paddingBlock={'space-0 space-16'} style={{ display: 'flex' }}>
      <TextField
        label="Tittel"
        style={{ width: '400px' }}
        defaultValue={inputValue.title}
        onChange={(event) =>
          setInputValue({ ...inputValue, title: uppercaseCategoryTitle(event.currentTarget.value.trimEnd()) })
        }
      />
      <Textarea
        label={'Beskrivelse'}
        style={{ width: '400px' }}
        defaultValue={inputValue.data.description}
        onChange={(event) =>
          setInputValue({ ...inputValue, data: { ...inputValue.data, description: event.currentTarget.value } })
        }
      />
      {isLoading || !categories ? (
        <Skeleton />
      ) : (
        <SubCategoriesModule categories={categories} inputValue={inputValue} setInputValue={setInputValue} id={id} />
      )}
      <IsoModule inputValue={inputValue} setInputValue={setInputValue} />
      <FilterModule inputValue={inputValue} setInputValue={setInputValue} />
      <HStack gap={'space-16'}>
        <Textarea
          label={'Ikon-svg'}
          maxRows={5}
          style={{ width: '400px' }}
          UNSAFE_autoScrollbar
          defaultValue={inputValue.data.icon}
          onChange={(event) =>
            setInputValue({ ...inputValue, data: { ...inputValue.data, icon: event.currentTarget.value } })
          }
        />

        {inputValue.data.icon && inputValue.data.icon?.length > 0 && (
          <VStack>
            <BodyShort weight={'semibold'}>Ikon:</BodyShort>
            {
              <Image
                width={60}
                height={60}
                alt={'ikon'}
                src={`data:image/svg+xml;utf8,${encodeURIComponent(inputValue.data.icon)}`}
              />
            }
          </VStack>
        )}
      </HStack>
    </VStack>
  )
}

const IsoModule = ({
  inputValue,
  setInputValue,
}: {
  inputValue: EditableCategoryDTO
  setInputValue: (value: EditableCategoryDTO) => void
}) => {
  const [isoFieldValue, setIsoFieldValue] = useState('')

  const addIso = () => {
    if (isoFieldValue != '') {
      setInputValue({
        ...inputValue,
        data: { ...inputValue.data, isos: [...(inputValue.data.isos ?? []), isoFieldValue.trim()] },
      })
      setIsoFieldValue('')
    }
  }

  return (
    <VStack gap={'space-8'}>
      <HStack gap={'space-4'} align={'end'}>
        <TextField
          label={'ISO-er'}
          value={isoFieldValue}
          style={{ width: '100px' }}
          onChange={(event) => setIsoFieldValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addIso()
            }
          }}
        />
        {isoFieldValue.length > 0 && <Button variant="tertiary" icon={<PlusCircleIcon />} onClick={addIso}></Button>}
      </HStack>
      <Chips>
        {inputValue.data.isos?.map((iso) => (
          <Chips.Removable
            key={iso + '-chip'}
            onClick={() =>
              setInputValue({
                ...inputValue,
                data: {
                  ...inputValue.data,
                  isos: [...(inputValue.data.isos ?? []).filter((i) => i != iso)],
                },
              })
            }
          >
            {iso}
          </Chips.Removable>
        ))}
      </Chips>
    </VStack>
  )
}

type Options = {
  label: string
  value: string
}

export function arrayMoveMutable(array: any[], fromIndex: number, toIndex: number) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex

    const [item] = array.splice(fromIndex, 1)
    array.splice(endIndex, 0, item)
  }
}

export function arrayMoveImmutable(array: any[], fromIndex: number, toIndex: number) {
  const newArray = [...array]
  arrayMoveMutable(newArray, fromIndex, toIndex)
  return newArray
}

const SubCategoriesModule = ({
  categories,
  inputValue,
  setInputValue,
  id = '',
}: {
  categories: CategoryAdminDTO[]
  inputValue: EditableCategoryDTO
  setInputValue: (value: EditableCategoryDTO) => void
  id?: string
}) => {
  const options: Options[] =
    categories
      ?.filter((category) => category.id != id)
      .map((category) => ({
        label: category.title,
        value: category.id,
      })) ?? []

  const [selectedOptions, setSelectedOptions] = useState<Options[]>(
    inputValue.data.subCategories?.reduce<Options[]>(function (result, element) {
      //hvis en subkategori er slettet så ignoreres den, og forsvinner ved lagring
      const option = options.find((o) => o.value === element)
      if (option) {
        result.push(option)
      }
      return result
    }, []) ?? []
  )

  const updateSubcategories = (updatedSubcategories: Options[]) => {
    setSelectedOptions(updatedSubcategories)
    setInputValue({
      ...inputValue,
      data: { ...inputValue.data, subCategories: updatedSubcategories.flatMap((option) => option.value) },
      subcategories: updatedSubcategories.map((option, index) => {
        return { id: option.value, priority: index }
      }),
    })
  }

  const addSubCategory = (optionValue: string) => {
    const newSelected = [...selectedOptions, options.filter((option) => option.value === optionValue)[0]]
    updateSubcategories(newSelected)
  }
  const removeSubCategory = (optionValue: string) => {
    const newSelected = selectedOptions.filter((o) => o.value !== optionValue)
    updateSubcategories(newSelected)
  }

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    const rearrangedSelected = arrayMoveImmutable(selectedOptions, oldIndex, newIndex)
    updateSubcategories(rearrangedSelected)
  }

  return (
    <HStack gap={'space-32'} align={'start'}>
      <VStack gap={'space-8'} maxWidth={'400px'}>
        <UNSAFE_Combobox
          label={'Underkategorier'}
          isMultiSelect
          shouldAutocomplete
          shouldShowSelectedOptions={false}
          options={[...options].sort((a, b) => {
            if (inputValue.data.subCategories?.includes(a.value) && !inputValue.data.subCategories?.includes(b.value)) {
              return -1
            }

            if (!inputValue.data.subCategories?.includes(a.value) && inputValue.data.subCategories?.includes(b.value)) {
              return 1
            }

            return a.label.localeCompare(b.label)
          })}

          selectedOptions={selectedOptions}
          onToggleSelected={(option, isSelected) => (isSelected ? addSubCategory(option) : removeSubCategory(option))}
        />
        <SortableList onSortEnd={onSortEnd} className={styles.subcategoryList}>
          <VStack gap={'space-8'}>
            {selectedOptions?.map((option) => (
              <SortableItem key={option.value + '-chip'}>
                <HStack paddingInline={'space-16'} align={'center'}>
                  <ChipsPopover option={option} removeSubCategory={removeSubCategory} categories={categories} />
                </HStack>
              </SortableItem>
            ))}
          </VStack>
        </SortableList>
      </VStack>
      {selectedOptions && selectedOptions.length > 0 && (
        <Switch
          checked={inputValue.data.showSubCategoryIcons ?? true}
          onChange={(event) =>
            setInputValue({
              ...inputValue,
              data: { ...inputValue.data, showSubCategoryIcons: event.currentTarget.checked },
            })
          }
          size={'small'}
          style={{ width: 'fit-content' }}
        >
          Vis ikoner på underkategori-kort
        </Switch>
      )}
    </HStack>
  )
}

const FilterModule = ({
  inputValue,
  setInputValue,
}: {
  inputValue: EditableCategoryDTO
  setInputValue: (value: EditableCategoryDTO) => void
}) => {
  const options = [
    'Setebredde',
    'Setedybde',
    'Setehøyde',
    'Brukervekt maks',
    'Innendørs bruk',
    'Utendørs bruk',
    'Rammetype',
    'Totalbredde',
    'Totallengde',
    'Terskelhøyde',
    'Skrittlengde',
    'Madrasslengde',
    'Madrassbredde',
    'Ryggstøttebredde',
    'Bredde',
    'Lengde',
    'Dybde',
    'Materiale i trekk',
    'Fyllmateriale',
    'Høyderegulering elektrisk',
    'Høyderegulering hydraulisk',
    'Løftehøyde',
    'Veggmontert',
    'Gulvmontert',
    'Rettløft',
    'Skråløft',
  ]

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    options.filter((option) => inputValue.data.filters?.includes(option))
  )

  const addFilter = (optionValue: string) => {
    const newSelected = [...selectedOptions, options.filter((option) => option === optionValue)[0]]
    setSelectedOptions(newSelected)
    setInputValue({
      ...inputValue,
      data: { ...inputValue.data, filters: newSelected.flatMap((option) => option) },
    })
  }

  const removeFilter = (optionValue: string) => {
    const newSelected = selectedOptions.filter((option) => option !== optionValue)
    setSelectedOptions(newSelected)
    setInputValue({
      ...inputValue,
      data: { ...inputValue.data, filters: [...(inputValue.data.filters ?? []).filter((i) => i != optionValue)] },
    })
  }

  return (
    <VStack gap={'space-8'} maxWidth={'400px'}>
      <UNSAFE_Combobox
        label={'Filtere'}
        isMultiSelect
        shouldAutocomplete
        shouldShowSelectedOptions={false}
        options={options}
        selectedOptions={selectedOptions}
        onToggleSelected={(option, isSelected) => (isSelected ? addFilter(option) : removeFilter(option))}
      />
      <Chips>
        {inputValue.data.filters?.map((filter) => (
          <Chips.Removable key={filter + '-chip'} onClick={() => removeFilter(filter)}>
            {filter}
          </Chips.Removable>
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
  categories: CategoryAdminDTO[]
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false)
  const category = categories.find((cat) => cat.id === option.value)
  return (
    <HStack
      as={Box}
      gap={'space-8'}
      borderColor={'accent'}
      borderRadius={'full'}
      borderWidth={'1'}
      width={'fit-content'}
      height={'fit-content'}
      paddingInline={'space-12'}
      paddingBlock={'space-4'}
    >
      <SortableKnob>
        <MenuGridIcon fontSize="1.5rem" />
      </SortableKnob>
      <Box
        ref={ref}

        onMouseOver={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
        asChild
      >
        <HStack gap={'space-4'} justify={'space-between'} align={'end'}>
          <Link as={NextLink} href={option.value} title={'Gå til redigering'}>
            {option.label}
          </Link>
          <Button
            size={'xsmall'}
            variant={'tertiary'}
            icon={<XMarkIcon aria-hidden />}
            title={'Slett'}
            onClick={() => removeSubCategory(option.value)}
          />
        </HStack>
      </Box>
      <Popover anchorEl={ref.current} open={popoverOpen} onClose={() => setPopoverOpen(false)}>
        <Popover.Content>
          <VStack gap={'space-8'} width={'400px'}>
            <BodyShort weight={'semibold'}>{category?.title}</BodyShort>
            <BodyShort>{category?.data.description}</BodyShort>
            {category?.data.subCategories && category?.data.subCategories.length > 0 && (
              <BodyShort>
                Underkategorier:{' '}
                {categories
                  .filter((cat) => category.data.subCategories?.includes(cat.id))
                  .map((val) => ' ' + val.title)
                  .toString()}
              </BodyShort>
            )}
            {category?.data.isos && category?.data.isos.length > 0 && (
              <BodyShort>Iso-er: {category.data.isos.toString()}</BodyShort>
            )}
          </VStack>
        </Popover.Content>
      </Popover>
    </HStack>
  )
}
