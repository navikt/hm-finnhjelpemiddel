import { agreementHasNoProducts, mapAgreementFromSearch } from '@/utils/agreement-util'
import { getAgreementFromId } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import { BodyLong, Heading, LinkPanel } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import AgreementDescription from './AgreementDescription'
import '../agreement-page.scss'
import DocumentExpansionCard from './DocumentExpansionCard'

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
                <div>
                  <Heading level="1" size="large" className="spacing-top--small spacing-bottom--small">
                    {agreement.title}
                  </Heading>
                  <BodyLong>
                    {`Avtaleperiode: fra ${dateToString(agreement.published)} til ${dateToString(agreement.expired)}`}
                  </BodyLong>
                </div>
                {!agreementHasNoProducts(agreement.identifier) && (
                  <LinkPanel href={hrefSok} className="agreement-page__link-to-search">
                    Produkter: {agreement.label}
                  </LinkPanel>
                )}
                <AgreementDescription agreement={agreement} />
              </article>
              <article>
                <Heading level="1" size="medium">
                  Dokumenter
                </Heading>
                {agreement.attachments.map((attachment, i) => (
                  <DocumentExpansionCard key={i} attachment={attachment} />
                ))}
              </article>
            </div>
          </AnimateLayout>
        </div>
      )}
    </>
  )
}
