import { ChevronDownIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import classNames from 'classnames'
import React from 'react'

type Props = {
  title: string
  children: React.ReactNode
  className?: string
  open?: boolean
  spacing?: boolean
  activeFilters?: number
}

const ShowMore = ({ title, children, className, open, spacing, activeFilters }: Props) => {
  return (
    <details open={open} className={classNames(className, { spacing })}>
      <HStack as="summary" justify="space-between" className={activeFilters ? 'active-filters' : ''}>
        <HStack gap="1">
          <span>{title}</span>
          {activeFilters && <span style={{ fontWeight: 'bold' }}>({activeFilters})</span>}
        </HStack>

        <div className="chevron-wrapper">
          <ChevronDownIcon fontSize="1.7rem" aria-hidden />
        </div>
      </HStack>
      <div>{children}</div>
    </details>
  )
}

export default ShowMore
