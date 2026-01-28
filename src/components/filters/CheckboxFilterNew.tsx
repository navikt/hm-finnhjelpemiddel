import { ActionMenu, Button } from '@navikt/ds-react'
import { useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from '@/components/filters/CheckboxFilterNew.module.scss'

export type FilterMenuLabel = {
  key: string
  label: string
  paramKey?: string
}

export type FilterOption = string | { value: string; label: string }

export type FilterMenu = {
  name: FilterMenuLabel
  options: FilterOption[]
}

type Props = {
  filterMenu: FilterMenu
  onChange: (key: string, value: string | string[]) => void
}

export const CheckboxFilterNew = ({ filterMenu, onChange }: Props) => {
  const searchParams = useSearchParams()
  const { options, name } = filterMenu
  const [menuOpen, setMenuOpen] = useState(false)

  const paramKey = name.paramKey ?? name.key
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )
  const selectedFilters = normalizedOptions.filter((o) => searchParams.getAll(paramKey).includes(o.value))
  const filterLabel = selectedFilters.length > 0 ? name.label + `(${selectedFilters.length})` : name.label

  return (
    <ActionMenu onOpenChange={(open) => setMenuOpen(open)}>
      <ActionMenu.Trigger>
        <Button
          variant={'secondary'}
          size={'small'}
          icon={menuOpen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
          iconPosition={'right'}
          className={selectedFilters.length > 0 ? styles.filterButtonActive : styles.filterButton}
        >
          {filterLabel}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content className={styles.filterMenu}>
        {selectedFilters.length > 0 && (
          <ActionMenu.Item variant={'danger'} icon={<TrashIcon />} onSelect={() => onChange(name.key, '')}>
            Fjern filter
          </ActionMenu.Item>
        )}
        {normalizedOptions.map((option) => (
          <ActionMenu.CheckboxItem
            key={`${name.key}-${option.value}`}
            checked={selectedFilters.some((f) => f.value === option.value)}
            onCheckedChange={() => onChange(name.key, option.value)}
          >
            {option.label}
          </ActionMenu.CheckboxItem>
        ))}
      </ActionMenu.Content>
    </ActionMenu>
  )
}
