import { ActionMenu, Button, HStack, TextField } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from './MinMaxFilter.module.scss'
import useQueryString from '@/utils/search-params-util'

export type MinMaxMenu = {
  name: string
  options: {
    min: {
      key: string
      value: number
    }
    max: {
      key: string
      value: number
    }
  }
}

type Props = {
  filterMenu: MinMaxMenu
}

export const MinMaxFilter = ({ filterMenu }: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { createQueryStringForMinMax } = useQueryString()

  const { options, name } = filterMenu
  const [menuOpen, setMenuOpen] = useState(false)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  const filterLabel = name

  const hasSearchParam = searchParams.get(options.min.key) || searchParams.get(options.max.key)
  const [inputValue, setInputValue] = useState(hasSearchParam ?? '')

  const onChange = (value: string) => {
    const newSearchParams = createQueryStringForMinMax(
      { name: options.min.key, value },
      { name: options.max.key, value }
    )
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const setValue = () => {
    menuTriggerRef?.current?.click()
    onChange(inputValue)
  }

  const onReset = () => {
    onChange('')
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
        {hasSearchParam && (
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={onReset}>
            Fjern filter
          </ActionMenu.Item>
        )}
        <HStack gap={'2'}>
          <TextField
            label={filterLabel}
            hideLabel
            inputMode={'numeric'}
            size={'small'}
            min={0}
            defaultValue={inputValue}
            onChange={(event) => setInputValue(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') setValue()
            }}
            style={{ width: '80px' }}
          />
          <Button variant={'tertiary'} size={'xsmall'} onClick={setValue}>
            Bruk
          </Button>
        </HStack>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
