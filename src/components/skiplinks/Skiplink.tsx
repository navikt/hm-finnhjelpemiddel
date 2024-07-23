'use client'
import React from 'react'
import style from './Skiplink.module.scss'
import { Link } from '@navikt/ds-react'

const Skiplink = () => (
  <Link href={'#hovedinnhold'} variant="subtle" className={style.skiplink}>
    Hopp til hovedinnhold
  </Link>
)

export default Skiplink
