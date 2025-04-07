import { Button, Hide } from '@navikt/ds-react'
import Pepperkakemann from '@/app/pynt/Pepperkakemann'
import React from 'react'
import Egg from '@/app/pynt/Egg'

export const Pynt = ({ vis, clickPynt, pyntType }: { vis: boolean; clickPynt: () => void; pyntType: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        alignContent: 'flex-start',
        marginRight: 'auto',
        paddingLeft: '1rem',
      }}
    >
      <Hide below="md">
        <PynteKnapp active={vis} clickPynt={clickPynt} pyntType={pyntType} />
      </Hide>
      <Hide above="sm">
        <PynteKnapp active={vis} clickPynt={clickPynt} pyntType={pyntType} size={'xs'} />
      </Hide>
    </div>
  )
}

const PynteKnapp = ({
  active,
  clickPynt,
  size,
  pyntType,
}: {
  active: boolean
  clickPynt: () => void
  size?: string
  pyntType: string
}) => {
  const title = pyntType === 'paaske' ? 'Påskepynt' : 'Julepynt'
  const ariaDescription = pyntType === 'paaske' ? 'Viser påskepynt på skjermen' : 'Viser snø på skjermen'
  const icon =
    pyntType === 'paaske' ? <Egg active={active} aria-hidden /> : <Pepperkakemann active={active} aria-hidden />

  return (
    <Button
      size={size === 'xs' ? 'xsmall' : 'medium'}
      variant="tertiary-neutral"
      title={title}
      aria-description={ariaDescription}
      icon={icon}
      onClick={() => clickPynt()}
    />
  )
}
