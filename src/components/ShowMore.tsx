import React from 'react'
import { ChevronDownIcon } from '@navikt/aksel-icons'
import classNames from 'classnames'

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
      <summary>
        <div className="chevron-wrapper">
          <ChevronDownIcon fontSize="1.7rem" aria-hidden />
        </div>
        {title}
      </summary>
      <div>{children}</div>
    </details>
  )
}

export default ShowMore
