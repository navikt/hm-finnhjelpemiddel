import { Button, HStack, Popover, TextField } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useId, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import styles from './RangeFilter.module.scss'
import useQueryString from '@/utils/search-params-util'
import { TechDataFilterAgg } from '@/app/kategori/utils/kategori-types'

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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const popoverId = useId()

  const { options, name } = filterMenu
  const [menuOpen, setMenuOpen] = useState(false)

  const filterLabel = name

  const hasSearchParam = searchParams.get(options.filter.searchParamName)
  const searchParamFrom = hasSearchParam?.split(':')[0]
  const searchParamTo = hasSearchParam?.split(':')[1]
  const [inputValueFrom, setInputValueFrom] = useState(searchParamFrom ?? '')
  const [inputValueTo, setInputValueTo] = useState(searchParamTo ?? '')

  const onChange = (valueFrom: string, valueTo: string) => {
    setMenuOpen(false)
    const fromToValue = valueFrom === '' && valueTo === '' ? '' : `${valueFrom}:${valueTo}`
    const newSearchParams = createQueryStringForMinMax(options.filter.searchParamName, fromToValue)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  const setValue = () => {
    onChange(inputValueFrom, inputValueTo)
  }

  const fromLabel = options.filter.unit ? `Fra (${options.filter.unit})` : 'Fra'
  const toLabel = options.filter.unit ? `Til (${options.filter.unit})` : 'Til'

  if (filterMenu.options.values.length <= 1 && !hasSearchParam) {
    return <></>
  }

  return (
    <div>
      <Button
        variant={'secondary'}
        size={'small'}
        icon={menuOpen ? <ChevronUpIcon aria-hidden /> : <ChevronDownIcon aria-hidden />}
        iconPosition={'right'}
        className={hasSearchParam ? styles.filterButtonActive : styles.filterButton}
        onClick={() => setMenuOpen(!menuOpen)}
        ref={setAnchorEl}
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? popoverId : undefined}
      >
        {filterLabel}
      </Button>
      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setMenuOpen(!menuOpen)}
        placement={'bottom'}
        onClick={(event) => {
          // for å holde menyen åpen når man klikker på inputfelt :)
          event.stopPropagation()
        }}
      >
        <Popover.Content>
          <HStack gap={'space-8'} align={'end'} padding={'space-8'}>
            <TextField
              label={fromLabel}
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
              label={toLabel}
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
        </Popover.Content>
      </Popover>
    </div>
  )
}
