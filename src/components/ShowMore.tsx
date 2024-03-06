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
}

const ShowMore = ({ title, children, className, open, spacing }: Props) => {
  return (
    <details open={open} className={classNames(className, { spacing })}>
      <HStack as="summary" justify="space-between">
        {title}
        <div className="chevron-wrapper">
          <ChevronDownIcon fontSize="1.7rem" aria-hidden />
        </div>
      </HStack>
      <div>{children}</div>
    </details>
  )
}

export default ShowMore
