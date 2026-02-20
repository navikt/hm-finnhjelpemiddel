import { ActionMenu, Button, HStack, TextField } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import styles from './MinMaxFilter.module.scss'
import useQueryString from '@/utils/search-params-util'
import { TechDataFilterAgg } from '@/app/kategori/utils/kategori-inngang-util'

export type MinMaxMenu = {
  name: string
  options: TechDataFilterAgg
}

type Props = {
  filterMenu: MinMaxMenu
}

export const RangeFilter = ({ filterMenu }: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { createQueryStringForMinMax } = useQueryString()

  const { options, name } = filterMenu
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  const filterLabel = name

  const hasSearchParam = searchParams.get(options.filter.searchParamName)
  const searchParamFrom = hasSearchParam?.split(':')[0]
  const searchParamTo = hasSearchParam?.split(':')[1]
  const [inputValueFrom, setInputValueFrom] = useState(searchParamFrom ?? '')
  const [inputValueTo, setInputValueTo] = useState(searchParamTo ?? '')

  const onChange = (valueFrom: string, valueTo: string) => {
    const fromToValue = valueFrom === '' && valueTo === '' ? '' : `${valueFrom}:${valueTo}`
    const newSearchParams = createQueryStringForMinMax(options.filter.searchParamName, fromToValue)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const setValue = () => {
    menuTriggerRef?.current?.click()
    onChange(inputValueFrom, inputValueTo)
  }

  return (
    <ActionMenu onOpenChange={(open) => setMenuOpen(open)}>
      <ActionMenu.Trigger ref={menuTriggerRef}>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={menuOpen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          className={hasSearchParam ? styles.filterButtonActive : styles.filterButton}
        >
          {filterLabel}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content className={styles.filterMenu}>
        <HStack gap={'space-8'} align={'end'}>
          <TextField
            label="Fra"
            inputMode={'numeric'}
            size={'small'}
            min={0}
            defaultValue={inputValueFrom}
            onChange={(event) => setInputValueFrom(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') setValue()
            }}
            style={{ width: '80px' }}
          />
          <TextField
            label="Til"
            inputMode={'numeric'}
            size={'small'}
            min={0}
            defaultValue={inputValueTo}
            onChange={(event) => setInputValueTo(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') setValue()
            }}
            style={{ width: '80px' }}
          />
          <Button variant={'primary'} size={'small'} onClick={setValue}>
            Bruk
          </Button>
        </HStack>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
