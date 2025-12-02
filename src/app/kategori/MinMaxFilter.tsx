import { ActionMenu, Button, TextField } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
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

  const filterLabel = name

  const hasInputValue = searchParams.get(options.min.key) || searchParams.get(options.max.key)

  const onChange = (value: string) => {
    const newSearchParams = createQueryStringForMinMax(
      { name: options.min.key, value },
      { name: options.max.key, value }
    )
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
    onChange('')
  }

  return (
    <ActionMenu onOpenChange={(open) => setMenuOpen(open)}>
      <ActionMenu.Trigger>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={menuOpen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          className={hasInputValue ? styles.filterButtonActive : styles.filterButton}
        >
          {filterLabel}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content className={styles.filterMenu}>
        {hasInputValue && (
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={onReset}>
            Fjern filter
          </ActionMenu.Item>
        )}
        <TextField
          label={filterLabel}
          hideLabel
          inputMode={'numeric'}
          size={'small'}
          min={0}
          defaultValue={hasInputValue ?? undefined}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      </ActionMenu.Content>
    </ActionMenu>
  )
}
