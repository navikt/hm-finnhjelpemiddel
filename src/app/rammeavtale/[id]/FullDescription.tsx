'use client'

import React, { useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

export const FullDescription = ({ descriptionHtml }: { descriptionHtml: string }) => {
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false)
  return (
    <>
      {showFullDescription && <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />}
      {showFullDescription ? (
        <Button
          className="home-page__chevron-button"
          variant="tertiary"
          iconPosition="right"
          icon={<ChevronUpIcon aria-hidden />}
          onClick={() => setShowFullDescription(false)}
        >
          Les mer om betydning av dette for søknad om produkt
        </Button>
      ) : (
        <Button
          className="home-page__chevron-button"
          variant="tertiary"
          iconPosition="right"
          icon={<ChevronDownIcon aria-hidden />}
          onClick={() => setShowFullDescription(true)}
        >
          Les mindre om betydning av dette for søknad om produkt
        </Button>
      )}
    </>
  )
}

export default FullDescription
