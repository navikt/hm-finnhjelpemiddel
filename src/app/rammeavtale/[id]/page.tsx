import NextLink from 'next/link'

import { agreementHasNoProducts, getAttachmentLabel, mapAgreementFromSearch } from '@/utils/agreement-util'
import { getAgreementFromId } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import File from '@/components/File'
import { BodyLong, ChevronRightIcon, Heading, LinkPanel } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import AgreementDescription from './AgreementDescription'
import '../agreement-page.scss'

export default async function AgreementPage({ params: { id: agreementId } }: { params: { id: string } }) {
  const agreement = mapAgreementFromSearch(await getAgreementFromId(agreementId))
  const hrefSok = `/sok?agreement=true&rammeavtale=${agreement?.label}`

  return (
    <>
      {agreement && (
        <div className="agreement-page">
          <AnimateLayout>
            <div className="agreement-page__content spacing-top--large spacing-bottom--xlarge">
              <article>
                {!agreementHasNoProducts(agreement.identifier) && (
                  <LinkPanel href={hrefSok} className="agreement-page__link-to-search">
                    Produkter: {agreement.label}
                  </LinkPanel>
                )}

                <div>
                  <Heading level="1" size="large" className="spacing-bottom--small">
                    {agreement.title}
                  </Heading>
                  <BodyLong>
                    {`Avtaleperiode: fra ${dateToString(agreement.published)} til
             ${dateToString(agreement.expired)}`}
                  </BodyLong>
                </div>
                <AgreementDescription agreement={agreement} />
              </article>
              <article>
                <Heading level="1" size="medium">
                  Dokumenter
                </Heading>
                {agreement.attachments.map((attachment, i) => (
                  <div key={i}>
                    <Heading level="2" size="small">
                      {getAttachmentLabel(attachment.title) ?? attachment.title}
                    </Heading>
                    <BodyLong>{attachment.description}</BodyLong>

                    {attachment.documents.length === 1 && (
                      <div className="document-list spacing-top--small spacing-bottom--medium">
                        <File
                          title={attachment.documents[0].title}
                          path={attachment.documents[0].uri}
                          date={attachment.documents[0].updated}
                        />
                      </div>
                    )}
                    {attachment.documents.length > 1 && (
                      <ul className="document-list spacing-top--small spacing-bottom--medium">
                        {attachment.documents.map((doc, index) => (
                          <li key={index}>
                            <File title={doc.title} path={doc.uri} date={doc.updated} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </article>
            </div>
          </AnimateLayout>
        </div>
      )}
    </>
  )
}
