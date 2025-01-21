'use client'

import { Document } from '@/utils/product-util'
import { BodyShort } from '@navikt/ds-react'
import { titleCapitalized } from '@/utils/string-util'
import { FileIcon } from '@/components/aksel-client'
import { logActionEvent } from '@/utils/amplitude'

export const Documents = ({ documents }: { documents: Document[] }) => {
  if (!documents.length) {
    return <BodyShort>Ingen dokumenter er lagt til av leverandør på dette hjelpemiddelet.</BodyShort>
  }

  const documentLoader = (path: string) => {
    return `${process.env.CDN_URL}${path}`
  }

  return (
    <ul className="document-list">
      {documents.map((doc, index) => (
        <li key={index}>
          <div className="file-container">
            <FileIcon aria-hidden fontSize="1.5rem" />
            <a
              href={documentLoader(doc.uri)}
              target="_blank"
              rel="noreferrer"
              onClick={() => logActionEvent('dokumentnedlasting')}
            >
              <span>{titleCapitalized(doc.title)} (PDF) </span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
