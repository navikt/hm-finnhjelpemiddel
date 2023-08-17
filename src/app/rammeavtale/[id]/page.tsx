import NextLink from 'next/link'

import { mapAgreementFromSearch } from '@/utils/agreement-util'
import { getAgreementFromIdentifier } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import AgreementIcon from '@/components/AgreementIcon'
import ReadMore from '@/components/ReadMore'
import { BodyLong, ChevronRightIcon, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import AgreementDescription from './AgreementDescription'
import './agreement-page.scss'

export default async function AgreementPage({ params: { id: agreementId } }: { params: { id: string } }) {
  const agreement = mapAgreementFromSearch(await getAgreementFromIdentifier(agreementId))
  const hrefSok = `/sok?agreement=true&rammeavtale=${agreementId}`

  const documentLoader = (uri: string) => {
    return `https://www.hjelpemiddeldatabasen.no/blobs/${uri}`
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
            <Heading level="1" size="large">
              {agreement.title}
            </Heading>
            <BodyLong spacing>
              {`Avtaleperiode: fra ${dateToString(agreement.published)} til
             ${dateToString(agreement.expired)}`}
            </BodyLong>

            <AgreementDescription agreement={agreement} />
          </article>
          <article>
            <Heading level="1" size="large">
              Slik kan du se at et hjelpemiddel er på avtale med NAV
            </Heading>

            <div className="agreement-page__icon-containers">
              <div className="agreement-page__icon-container">
                <AgreementIcon rank={99} />
                <BodyLong>Er på avtale med NAV, men har ikke en spesifikk rangering</BodyLong>
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
            {/* <Heading level="2" size="small">
                Hvordan man ser at et produkt, tilbehør eller en reservedel er på avtale med NAV:
              </Heading> */}

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
            <Heading level="1" size="large" spacing>
              Dokumenter
            </Heading>
            {agreement.attachments.map((attachment) => (
              <>
                <Heading level="2" size="small" spacing>
                  {attachment.title}
                </Heading>
                <BodyLong>{attachment.description}</BodyLong>
                {attachment.documents.map((doc, index) => (
                  <li key={index}>
                    {doc.title.length > 0 && (
                      <a href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
                        {doc.title} (PDF)
                      </a>
                    )}
                    {doc.title.length == 0 && (
                      <a href={documentLoader(doc.uri)} target="_blank" rel="noreferrer">
                        Dokument uten navn (PDF)
                      </a>
                    )}
                  </li>
                ))}
              </>
            ))}
          </article>
        </div>
      </AnimateLayout>
    </div>
  )
}
