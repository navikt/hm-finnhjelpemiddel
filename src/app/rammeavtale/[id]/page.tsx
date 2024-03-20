import type { Metadata } from 'next'

import { agreementHasNoProducts, mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import { BodyLong, BodyShort, Heading, Link } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'

import { HStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import AgreementDescription from './AgreementDescription'
import DocumentExpansionCard from './DocumentExpansionCard'
import LinkToAgreement from './LinkToAgreement'

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agreementId = params.id
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))

  return {
    title: 'Rammeavtale ' + agreement.title,
    description: 'Rammeavtale for ' + agreement.title,
  }
}

export default async function AgreementPage({ params }: Props) {
  const agreement = mapAgreementFromDoc(await getAgreement(params.id))
  const hrefHurtigoversikt = `/rammeavtale/hjelpemidler/${params.id}`
  // const hrefSok = `/sok?agreement&rammeavtale=${agreement?.label}`

  const dontShow =
    (process.env.BUILD_ENV === 'prod'
      ? agreement.id === 'e3c8e7ca-8118-4c24-b2fd-13b765de99e3'
      : agreement.id === '042360ce-ee2d-4275-b864-c4009b5af371') || agreementHasNoProducts(agreement.identifier)

  return (
    <>
      {agreement && (
        <div className="agreement-page">
          <AnimateLayout>
            <div className="agreement-page__content main-wrapper--small">
              <article>
                <div>
                  <HStack gap="3">
                    <Link as={NextLink} href="/rammeavtale" variant="subtle">
                      Avtaler med NAV
                    </Link>
                    <BodyShort textColor="subtle">/</BodyShort>
                  </HStack>
                  <Heading level="1" size="large" className="spacing-top--small spacing-bottom--small">
                    {agreement.title}
                  </Heading>
                  <BodyLong size="small">
                    {`Avtaleperiode: ${dateToString(agreement.published)} - ${dateToString(agreement.expired)}`}
                  </BodyLong>
                  <BodyLong size="small">{`Avtalenummer:  ${agreement.reference.includes('og') ? agreement.reference : agreement.reference.replace(' ', ' og ')}`}</BodyLong>
                </div>
                {!dontShow && (
                  <LinkToAgreement
                    hrefHurtigoversikt={hrefHurtigoversikt}
                    agreementLabel={agreement.label}
                  ></LinkToAgreement>
                )}
                <AgreementDescription agreement={agreement} />
              </article>
              <article>
                <Heading level="1" size="medium" id="dokumenter">
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
