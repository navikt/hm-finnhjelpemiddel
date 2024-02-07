'use client'

import { Button } from '@navikt/ds-react'
import Image from 'next/image'
import { createContext, useContext } from 'react'
import Snowfall from 'react-snowfall'

interface props {
  onClick: () => void
}

const PepperkakeDekorasjon = (props: props) => {
  const snowfallEnabled = useContext(SnowfallContext)

  return (
    <Button aria-pressed={snowfallEnabled} aria-label="La det snø!" $snowing={snowfallEnabled} onClick={props.onClick}>
      <Image src="/pepperkake.svg" width="65" height="41" alt="" aria-hidden={true} />

      {snowfallEnabled && <Snowfall />}
    </Button>
  )
}

export default PepperkakeDekorasjon

export const SnowfallContext = createContext(false)
