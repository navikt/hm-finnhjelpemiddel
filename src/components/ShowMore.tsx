import { ChevronDownIcon } from '@navikt/aksel-icons'
import { HStack } from '@navikt/ds-react'
import classNames from 'classnames'
import React, { useCallback, useEffect } from 'react'

type Props = {
  title: string
  children: React.ReactNode
  className?: string
  open?: boolean
  spacing?: boolean
}

const ShowMore = ({ title, children, className, open, spacing }: Props) => {
  const detailsRef = React.useRef<HTMLDetailsElement>(null)

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && detailsRef.current) {
      detailsRef.current.open = false // Close the details element
    }
  }, [])

  useEffect(() => {
    const currentDetailsRef = detailsRef.current
    if (currentDetailsRef) {
      currentDetailsRef.addEventListener('keyup', handleKeyUp)
    }
    return () => {
      if (currentDetailsRef) {
        currentDetailsRef.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [handleKeyUp])

  return (
    <details open={open} className={classNames(className, { spacing })} ref={detailsRef}>
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
