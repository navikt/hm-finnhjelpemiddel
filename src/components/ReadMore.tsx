'use client'

import React, { ReactNode, useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

export const ReadMore = ({
  content,
  buttonOpen,
  buttonClose,
  setFocus,
}: {
  content: ReactNode
  buttonOpen: string
  buttonClose: string
  setFocus?: () => void
}) => {
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false)
  return (
    <div className="read-more">
      {showFullDescription && content}
      {showFullDescription ? (
        <Button
          className="home-page__chevron-button"
          variant="tertiary"
          iconPosition="right"
          icon={<ChevronUpIcon aria-hidden />}
          onClick={() => {
            if (setFocus) {
              setShowFullDescription(false)
              setFocus()
            } else {
              setShowFullDescription(false)
            }
          }}
        >
          {buttonClose}
          {/* Les mindre om betydning av dette for søknad om produkt */}
        </Button>
      ) : (
        <Button
          className="home-page__chevron-button"
          variant="tertiary"
          iconPosition="right"
          icon={<ChevronDownIcon aria-hidden />}
          onClick={() => setShowFullDescription(true)}
        >
          {buttonOpen}
        </Button>
      )}
    </div>
  )
}

export default ReadMore
