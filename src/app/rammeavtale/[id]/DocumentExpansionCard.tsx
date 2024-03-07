'use client'

import { BodyShort, ExpansionCard, VStack } from '@navikt/ds-react'

import { Attachment } from '@/utils/agreement-util'

import File from '@/components/File'

export const DocumentExpansionCard = ({ attachment }: { attachment: Attachment }) => (
  <ExpansionCard size="small" aria-label="Heading-size small demo">
    <ExpansionCard.Header>
      <ExpansionCard.Title as="h2" size="small" style={{ fontSize: '18px' }}>
        {attachment.title}
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

export default DocumentExpansionCard
