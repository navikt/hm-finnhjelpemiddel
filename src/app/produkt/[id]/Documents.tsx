'use client'

import { Document } from '@/utils/product-util'
import { BodyShort, Link } from '@navikt/ds-react'
import { titleCapitalized } from '@/utils/string-util'
import { FileIcon } from '@/components/aksel-client'
import styles from './Documents.module.scss'
import NextLink from 'next/link'

export const Documents = ({ documents }: { documents: Document[] }) => {
  if (!documents.length) {
    return <BodyShort>Ingen dokumenter er lagt til av leverandør på dette hjelpemiddelet.</BodyShort>
  }

  const documentLoader = (path: string) => {
    return `${process.env.CDN_URL}${path}`
  }

  return (
    <ul className={styles.documentList}>
      {documents.map((doc, index) => (
        <li key={index} className={styles.fileContainer}>
          <Link as={NextLink} href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
            {titleCapitalized(doc.title)} (PDF)
            <FileIcon aria-hidden fontSize="1.5rem" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
