import NextLink from 'next/link'

import { getAttachmentLabel, mapAgreementFromSearch } from '@/utils/agreement-util'
import { getAgreementFromIdentifier } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import AgreementIcon from '@/components/AgreementIcon'
import File from '@/components/File'
import ReadMore from '@/components/ReadMore'
import { BodyLong, ChevronRightIcon, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import AgreementDescription from './AgreementDescription'
import DocumentAccordion from './DocumentAccordion'
import './agreement-page.scss'

export default async function AgreementPage({ params: { id: agreementId } }: { params: { id: string } }) {
  const agreement = mapAgreementFromSearch(await getAgreementFromIdentifier(agreementId))
  const hrefSok = `/sok?agreement=true&rammeavtale=${agreementId}`

  const documentLoader = (uri: string) => {
    return `${process.env.CDN_URL}${uri}`
  }
  return (
    <div className="agreement-page">
      <AnimateLayout>
        <div className="agreement-page__content spacing-top--xlarge spacing-bottom--xlarge">
          <div className="agreement-page__link-to-search">
            <NextLink href={hrefSok}>
              <Heading level="1" size="medium">
                Se produkter under avtale: Manuelle rullestoler
              </Heading>
            </NextLink>
            <ChevronRightIcon aria-hidden fontSize="1.5rem" />
          </div>
          <article>
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
              Slik kan du se at et hjelpemiddel er på avtale med NAV
            </Heading>

            <div className="agreement-page__icon-containers">
              <div className="agreement-page__icon-container">
                <AgreementIcon rank={99} />
                <BodyLong>Er på avtale med NAV uten spesifikk rangering.</BodyLong>
              </div>
              <div className="agreement-page__icon-container">
                <AgreementIcon rank={1} />
                <BodyLong>Er på avtale med NAV, og er rangert som nr 1 på sin delkontrakt.</BodyLong>
              </div>
              <div className="agreement-page__icon-container">
                <AgreementIcon rank={4} />
                <BodyLong>Er på avtale med NAV, og er rangert som nr 4 på sin delkontrakt.</BodyLong>
              </div>
            </div>

            <ReadMore
              content={
                <>
                  <Heading level="2" size="small">
                    Hva om produktet jeg mener passer for meg ikke har denne merkingen?
                  </Heading>
                  <BodyLong spacing>{'<Tekst her om hva det vil si>'}</BodyLong>{' '}
                  <Heading level="2" size="small">
                    Hva om produktet jeg mener passer for meg er rangert som nummer 2, 3 eller 4?
                  </Heading>
                  <BodyLong spacing>{'<Tekst her om hva det vil si>'}</BodyLong>{' '}
                  <Heading level="2" size="small">
                    Hva vil det si at et produkt ikke har spesifikk rangering?
                  </Heading>
                  <BodyLong spacing>{'<Tekst her om hva det vil si>'}</BodyLong>
                </>
              }
              buttonOpen={'Les mer om betydning av dette for søknad om produkt'}
              buttonClose={'Les mindre om betydning av dette for søknad om produkt'}
            />
          </article>
          <article>
            <Heading level="1" size="medium">
              Dokumenter
            </Heading>
            {agreement.attachments.map((attachment) => (
              <div key={attachment.title}>
                <Heading level="2" size="small">
                  {getAttachmentLabel(attachment.title) ?? attachment.title}
                </Heading>
                <BodyLong>{attachment.description}</BodyLong>

                {attachment.documents.length === 1 && (
                  <div className="document-list">
                    <File
                      title={attachment.documents[0].title}
                      path={attachment.documents[0].uri}
                      date={attachment.documents[0].updated}
                    />
                  </div>
                )}
                {attachment.documents.length > 1 && (
                  <ul className="document-list">
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
  )
}
