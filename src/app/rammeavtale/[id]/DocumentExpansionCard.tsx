'use client'

import { BodyShort, ExpansionCard, VStack } from '@navikt/ds-react'

import { Attachment } from '@/utils/agreement-util'

import File from '@/components/File'
import { useEffect, useRef, useState } from 'react'

export const DocumentExpansionCard = ({ attachment }: { attachment: Attachment }) => {
  const trimmedTitle = attachment.title.trim()
  const id = trimmedTitle === 'Tilbehør' ? 'Tilbehor' : trimmedTitle
  const [isOpen, setIsOpen] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const attachmentId_Url = window.location.hash.slice(1)
    if (attachmentId_Url === id && cardRef.current) {
      cardRef.current.style.scrollMargin = '60px'
      cardRef.current.scrollIntoView({ behavior: 'smooth' })

      setIsOpen(true)
    }
  }, [cardRef.current])

  return (
    <ExpansionCard
      ref={cardRef}
      size="small"
      aria-label="Heading-size small demo"
      open={isOpen}
      onToggle={() => setIsOpen(!isOpen)}
    >
      <ExpansionCard.Header id={id}>
        <ExpansionCard.Title as="h2" size="small" style={{ fontSize: '18px' }}>
          {isOpen ? `${attachment.title} åpen` : `${attachment.title} lukket`}
        </ExpansionCard.Title>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap={{ xs: '4', md: '8' }}>
          <div style={{ maxWidth: '550px' }} dangerouslySetInnerHTML={{ __html: attachment.description }}></div>
          {attachment.documents.length === 1 && (
            <div className="document-list spacing-bottom--medium">
              <File
                title={attachment.documents[0].title}
                path={attachment.documents[0].uri}
                date={attachment.documents[0].updated}
              />
            </div>
          )}
          {attachment.documents.length > 1 && (
            <ul className="document-list spacing-bottom--medium">
              {attachment.documents.map((doc, index) => (
                <li key={index}>
                  <File title={doc.title} path={doc.uri} date={doc.updated} />
                </li>
              ))}
            </ul>
          )}
          {attachment.documents.length === 0 && <BodyShort size="small">Ingen dokumenter</BodyShort>}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  )
}

export default DocumentExpansionCard
