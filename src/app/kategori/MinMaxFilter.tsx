import { ActionMenu, Button, HStack, TextField } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@navikt/aksel-icons'
import styles from './MinMaxFilter.module.scss'
import useQueryString from '@/utils/search-params-util'

export type MinMaxMenu = {
  name: string
  options: {
    minKey: string
    maxKey: string
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

  const hasInputValue = searchParams.get(options.minKey) || searchParams.get(options.maxKey)

  const onChange = (key: string, value: string, key1: string, value2: string) => {
    const newSearchParams = createQueryStringForMinMax({ name: key, value }, { name: key1, value: value2 })
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const onReset = () => {
    onChange(options.minKey, '', options.maxKey, '')
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
        <HStack gap={'4'}>
          <TextField
            label={'Min'}
            type={'number'}
            size={'small'}
            min={0}
            onChange={(event) => onChange(options.minKey, event.currentTarget.value, '', '')}
          />
          <TextField
            label={'Max'}
            type={'number'}
            size={'small'}
            min={0}
            onChange={(event) => onChange(options.maxKey, event.currentTarget.value, '', '')}
          />
        </HStack>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
