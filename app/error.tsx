'use client'
import { Button } from '@navikt/ds-react'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="main-wrapper">
      <h1>Noe gikk galt.</h1>
      <Button onClick={() => reset()}>Prøv igjen</Button>
    </div>
  )
}
