'use client'
import React from 'react'
import { Link } from '@navikt/ds-react'

function SkipLink({ href = '#hovedinnhold', text = 'Hopp til hovedinnhold' }) {
  return (
    <Link href={href} className="skiplink">
      {text}
    </Link>
  )
}

export default SkipLink
