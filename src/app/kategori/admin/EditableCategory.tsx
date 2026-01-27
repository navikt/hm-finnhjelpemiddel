'use client'

import {
  BodyShort,
  Box,
  Button,
  Chips,
  HStack,
  Link,
  Popover,
  Skeleton,
  Textarea,
  TextField,
  UNSAFE_Combobox,
  VStack,
} from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { CategoryAdminDTO, EditableCategoryDTO, getCategories } from '@/app/kategori/admin/category-admin-util'
import useSWR from 'swr'
import NextLink from 'next/link'
import { PlusCircleIcon, XMarkIcon } from '@navikt/aksel-icons'
import Image from 'next/image'

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
    <VStack gap={"space-16"} paddingBlock={"space-0 space-16"} style={{ display: 'flex' }}>
      <TextField
        label="Tittel"
        style={{ width: '400px' }}
        defaultValue={inputValue.title}
        onChange={(event) => setInputValue({ ...inputValue, title: event.currentTarget.value.trimEnd() })}
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
      <HStack gap={"space-16"}>
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
  );
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
        data: { ...inputValue.data, isos: [...(inputValue.data.isos ?? []), isoFieldValue] },
      })
      setIsoFieldValue('')
    }
  }

  return (
    <VStack gap={"space-8"}>
      <HStack gap={"space-4"} align={'end'}>
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
  );
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
  categories: CategoryAdminDTO[]
  inputValue: EditableCategoryDTO
  setInputValue: (value: EditableCategoryDTO) => void
  id?: string
}) => {
  const options: Options[] =
    categories
      ?.filter((category) => category.id != id)
      ?.sort((a, b) => {
        if (inputValue.data.subCategories?.includes(a.id) && !inputValue.data.subCategories?.includes(b.id)) {
          return -1
        }

        if (!inputValue.data.subCategories?.includes(a.id) && inputValue.data.subCategories?.includes(b.id)) {
          return 1
        }

        return a.title.localeCompare(b.title)
      })

      .map((category) => ({
        label: category.title,
        value: category.id,
      })) ?? []

  const [selectedOptions, setSelectedOptions] = useState<Options[]>(
    options.filter((option) => inputValue.data.subCategories?.includes(option.value))
  )

  const addSubCategory = (optionValue: string) => {
    const newSelected = [...selectedOptions, options.filter((option) => option.value === optionValue)[0]]
    setSelectedOptions(newSelected)
    setInputValue({
      ...inputValue,
      data: { ...inputValue.data, subCategories: newSelected.flatMap((option) => option.value) },
    })
  }
  const removeSubCategory = (optionValue: string) => {
    const newSelected = selectedOptions.filter((o) => o.value !== optionValue)
    setSelectedOptions(newSelected)
    setInputValue({
      ...inputValue,
      data: { ...inputValue.data, subCategories: newSelected.flatMap((option) => option.value) },
    })
  }

  return (
    <VStack gap={"space-8"} maxWidth={'400px'}>
      <UNSAFE_Combobox
        label={'Underkategorier'}
        isMultiSelect
        shouldAutocomplete
        shouldShowSelectedOptions={false}
        options={options}
        selectedOptions={selectedOptions}
        onToggleSelected={(option, isSelected) => (isSelected ? addSubCategory(option) : removeSubCategory(option))}
      />
      <HStack gap={"space-8"}>
        {selectedOptions?.map((option) => (
          <ChipsPopover
            key={option.value + '-chip'}
            option={option}
            removeSubCategory={removeSubCategory}
            categories={categories}
          />
        ))}
      </HStack>
    </VStack>
  );
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
    <>
      <Box
        ref={ref}
        borderColor={'border-action'}
        borderRadius={'full'}
        borderWidth={'1'}
        width={'fit-content'}
        height={'fit-content'}
        paddingInline={"space-12"}
        paddingBlock={"space-4"}
        onMouseOver={() => setPopoverOpen(true)}
        onMouseLeave={() => setPopoverOpen(false)}
        asChild
      >
        <HStack gap={"space-4"} justify={'space-between'} align={'end'}>
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
          <VStack gap={"space-8"} width={'400px'}>
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
    </>
  );
}
