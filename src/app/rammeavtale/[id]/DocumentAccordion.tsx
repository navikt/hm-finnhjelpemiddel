'use client'

import React from 'react'

import { Accordion } from '@navikt/ds-react'

import { Attachments } from '@/utils/agreement-util'
import { titleCapitalized } from '@/utils/string-util'

import File from '@/components/File'

export const DocumentAccordion = ({ attachments }: { attachments: Attachments }) => (
  <Accordion size="small">
    <Accordion.Item>
      <Accordion.Header>{attachments.title}</Accordion.Header>
      <Accordion.Content>
        <ul className="document-list">
          {attachments.documents.map((doc, index) => (
            <li key={index}>
              <File title={doc.title} path={doc.uri} date={doc.updated} />
            </li>
          ))}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion>
)

export default DocumentAccordion
