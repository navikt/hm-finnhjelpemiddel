import type { Metadata } from 'next'

import { Agreement, agreementHasNoProducts, mapAgreementFromDoc } from '@/utils/agreement-util'
import { getAgreement } from '@/utils/api-util'
import { dateToString } from '@/utils/string-util'

import { BodyLong, Heading } from '@/components/aksel-client'

import { Bleed, Button, HStack, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import AgreementDescription from './AgreementDescription'
import DocumentExpansionCard from './DocumentExpansionCard'
import { CalendarIcon, ChevronRightIcon, DocPencilIcon } from '@navikt/aksel-icons'
import styles from '@/app/rammeavtale/AgreementPage.module.scss'

type Props = {
  params: Promise<{ agreementId: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const agreementId = params.agreementId
  // Data vil cashes og blir ikke hentet på nytt på produktsiden: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
  const agreement = mapAgreementFromDoc(await getAgreement(agreementId))

  return {
    title: 'Rammeavtale ' + agreement.title,
    description: 'Rammeavtale for ' + agreement.title,
  }
}

export default async function AgreementPage(props: Props) {
  const params = await props.params
  const agreementResponse = await getAgreement(params.agreementId)
  const agreement = mapAgreementFromDoc(agreementResponse)

  return (
    <>
      {agreement && (
        <VStack
          marginInline={'auto'}
          marginBlock={'space-0'}
          maxWidth={'750px'}
          paddingBlock={'space-0 space-48'}
          paddingInline={{ xs: 'space-16', md: 'space-48' }}
          gap={{ xs: 'space-48', md: 'space-48' }}
        >
          <TopBar agreement={agreement} />
          <AgreementDescription agreement={agreement} />

          <VStack gap={'space-16'}>
            <Heading level="1" size="medium" id="dokumenter">
              Dokumenter
            </Heading>
            {agreement.attachments.map((attachment, i) => (
              <DocumentExpansionCard key={i} attachment={attachment} />
            ))}
          </VStack>
        </VStack>
      )}
    </>
  )
}

const TopBar = ({ agreement }: { agreement: Agreement }) => {
  //Midlertidig så lenge det ikke er produkter på omgivelsekontrollavtalen
  const hideProductLink =
    (process.env.BUILD_ENV === 'prod'
      ? agreement.id === 'e3c8e7ca-8118-4c24-b2fd-13b765de99e3'
      : agreement.id === '042360ce-ee2d-4275-b864-c4009b5af371') || agreementHasNoProducts(agreement.identifier)

  return (
    <Bleed style={{ backgroundColor: '#F5F9FF' }} reflectivePadding marginInline={'full'}>
      <VStack gap="space-32" align={'start'} paddingBlock={'space-48'}>
        <Heading level="1" size="xlarge">
          {agreement.title}
        </Heading>

        <VStack gap="space-16">
          <HStack gap="space-8" align={'center'}>
            <CalendarIcon aria-hidden width={'24px'} height={'24px'} />
            <BodyLong weight={'semibold'}>
              {dateToString(agreement.published)} - {dateToString(agreement.expired)}
            </BodyLong>
          </HStack>

          <HStack gap={'space-8'} align={'center'}>
            <DocPencilIcon aria-hidden width={'24px'} height={'24px'} />
            <BodyLong weight={'semibold'}>
              {agreement.reference.includes('og') ? agreement.reference : agreement.reference.replace(' ', ' og ')}
            </BodyLong>
          </HStack>
        </VStack>

        {!hideProductLink && (
          <NextLink href={`/rammeavtale/hjelpemidler/${agreement.id}`} passHref>
            <Button
              icon={<ChevronRightIcon aria-hidden />}
              variant={'secondary'}
              iconPosition={'right'}
              className={styles.bleedButton}
            >
              Se hjelpemidlene på denne avtalen
            </Button>
          </NextLink>
        )}
      </VStack>
    </Bleed>
  )
}
