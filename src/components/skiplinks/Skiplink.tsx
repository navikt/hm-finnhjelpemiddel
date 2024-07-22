'use client'
import React, { useEffect, useState } from 'react'
import style from './Skiplink.module.scss'
import { Link } from '@navikt/ds-react'

const mainContentId = 'hovedinnhold'
const mainContentHref = `#${mainContentId}`

const Skiplink = () => {
  const [hasMainContent, setHasMainContent] = useState(false)

  useEffect(() => {
    const mainContentElement = document.getElementById(mainContentId)
    setHasMainContent(!!mainContentElement)
  }, [])

  return hasMainContent ? (
    <nav>
      <Link href={mainContentHref} variant="subtle" className={style.skiplink}>
        Hoppe til hovedinnhold
      </Link>
    </nav>
  ) : null
}

export default Skiplink
