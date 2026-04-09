import { Chips } from '@navikt/ds-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import useQueryString from '@/utils/search-params-util'
import styles from './ToggleFilter.module.scss'

export type ToggleFilterLabel = {
  key: string
  label: string
}

export type ToggleFilterMenu = {
  name: ToggleFilterLabel
  options: boolean[]
}

type Props = {
  filterMenu: ToggleFilterMenu
}

export const ToggleFilter = ({ filterMenu }: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const { createQueryStringAppend } = useQueryString()

  const { options, name } = filterMenu

  const filterLabel = name.label

  const isActive = !!searchParams.get(name.key)

  if (options.length <= 1 && !isActive) {
    return <></>
  }

  const onChange = (value: boolean) => {
    const newSearchParams = createQueryStringAppend(name.key, (value || '').toString())
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  return (
    <Chips>
      <Chips.Toggle key={filterLabel} selected={isActive} onClick={() => onChange(!isActive)} className={styles.toggle}>
        {filterLabel}
      </Chips.Toggle>
    </Chips>
  )
}
