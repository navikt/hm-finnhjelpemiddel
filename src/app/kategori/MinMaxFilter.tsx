import { ActionMenu, Button, HStack, TextField } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { CaretDownFillIcon, CaretUpFillIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from './MinMaxFilter.module.scss'

export type FilterMenuLabel = {
  key: string
  label: string
}

export type MinMaxMenu = {
  name: FilterMenuLabel
  options: {
    minKey: string
    maxKey: string
  }
}

type Props = {
  filterMenu: MinMaxMenu
  onChange: (key: string, value: string) => void
}

export const MinMaxFilter = ({ filterMenu, onChange }: Props) => {
  const searchParams = useSearchParams()
  const { options, name } = filterMenu
  const [menuOpen, setMenuOpen] = useState(false)

  const minValue = 0
  const maxValue = 0
  const filterLabel = name.label

  const hasInputValue = minValue > 0 || maxValue > 0

  return (
    <ActionMenu onOpenChange={(open) => setMenuOpen(open)}>
      <ActionMenu.Trigger>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={menuOpen ? <CaretUpFillIcon aria-hidden /> : <CaretDownFillIcon aria-hidden />}
          iconPosition={'right'}
          className={hasInputValue ? styles.filterButtonActive : styles.filterButton}
        >
          {filterLabel}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content className={styles.filterMenu}>
        {hasInputValue && (
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={() => onChange(name.key, '')}>
            Fjern filter
          </ActionMenu.Item>
        )}
        <HStack gap={'4'}>
          <TextField
            label={'Min'}
            type={'number'}
            size={'small'}
            min={0}
            onChange={(event) => onChange(options.minKey, event.currentTarget.value)}
          />
          <TextField
            label={'Max'}
            type={'number'}
            size={'small'}
            min={0}
            onChange={(event) => onChange(options.maxKey, event.currentTarget.value)}
          />
        </HStack>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
