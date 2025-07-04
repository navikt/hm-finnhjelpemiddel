'use client'

import { FilterData, getFiltersAgreement, getProductsOnAgreement } from '@/utils/api-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import CompareMenu from '@/components/layout/CompareMenu'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { Agreement, mapAgreementProducts } from '@/utils/agreement-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { PostBucketResponse } from '@/utils/response-types'
import { dateToString } from '@/utils/string-util'
import { ArrowRightIcon, CalendarIcon, DocPencilIcon, FilePdfIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import { Alert, Bleed, BodyLong, Button, Heading, Hide, HStack, Loader, Stack, VStack } from '@navikt/ds-react'
import AgreementPrintableVersion from './AgreementPrintableVersion'
import FilterForm from './FilterForm'
import PostsList from './PostsList'
import PostsListIsoGroups from '@/app/rammeavtale/hjelpemidler/[agreementId]/PostsListIsoGroups'
import NextLink from 'next/link'
import styles from '@/app/rammeavtale/AgreementPage.module.scss'
import useSWRImmutable from 'swr/immutable'
import useQueryString from '@/utils/search-params-util'

export type FilterOption = {
  label: string
  value: string
}

export type AgreementFilters = {
  [key in 'leverandor' | 'delkontrakt']: FilterOption[]
}

const AgreementPage = ({ agreement }: { agreement: Agreement }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringAppend } = useQueryString()

  const searchData = mapSearchParams(searchParams)

  const avtalerMedIsoGruppering = [
    '9d8ff31e-c536-4f4d-9b2f-75cc527c727f',
    'b9a48c54-3004-4f94-ab65-b38deec78ed3',
    '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96',
  ]

  const {
    data: postBuckets,
    isLoading: postsIsLoading,
    error: postError,
  } = useSWR<PostBucketResponse[]>({ agreementId: agreement.id, searchData: searchData }, getProductsOnAgreement, {
    keepPreviousData: true,
  })

  const { data: filtersFromData } = useSWRImmutable<FilterData>(
    { agreementId: agreement.id, type: 'filterdata' },
    getFiltersAgreement,
    {
      keepPreviousData: true,
    }
  )

  const postFilters: FilterOption[] = agreement.posts
    .filter((post) => post.nr != 99 && post.title.length > 0)
    .sort((a, b) => a.nr - b.nr)
    .map((post) => ({ label: post.title, value: post.title }))

  if (!postBuckets || !filtersFromData) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Loader size="3xlarge" title="Laster produkter" />
      </HStack>
    )
  }

  const leverandorFilter: FilterOption[] =
    filtersFromData?.leverandor.values.map((value) => ({
      label: value.key.toString(),
      value: value.key.toString(),
    })) || []

  const filters: AgreementFilters = {
    leverandor: leverandorFilter,
    delkontrakt: postFilters,
  }

  //NB! Vi har brukt top_hits i open search til å hente produkter på delkontrakt og mapper over til serier her.
  //Dersom det finnes en delkontrakt med over 500 varianter vil ikke alle seriene vises. Da må vi vurdere å ha et kall per delkontrakt.
  const posts = mapAgreementProducts(postBuckets, agreement, searchData.filters)

  const totalProducts =
    posts.length > 0
      ? posts.map((post) => post.products.length).reduce((previousValue, currentValue) => previousValue + currentValue)
      : 0

  const onChange = (filterName: string, value: string) => {
    const newSearchParams = createQueryStringAppend(filterName, value)
    router.replace(`${pathname}?${newSearchParams}`, { scroll: false })
  }

  return (
    <>
      <AgreementPrintableVersion postWithProducts={posts} />
      <VStack gap={'10'} className="main-wrapper--large spacing-bottom--xlarge hide-print">
        <TopBar agreement={agreement} />

        <CompareMenu />

        <VStack gap={'4'}>
          <Heading level="2" size={'medium'}>
            {totalProducts} hjelpemidler i delkontrakter
          </Heading>

          <Stack direction={{ sm: 'column', md: 'row' }} justify="space-between" align="end" gap="4">
            <FilterForm filters={filters} onChange={onChange} />

            <Hide above={'sm'} asChild>
              <span className={styles.divider} />
            </Hide>

            <Hide below={'md'} asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  window.print()
                }}
                icon={<FilePdfIcon aria-hidden fontSize="1.5rem" />}
                iconPosition={'right'}
              >
                Skriv ut
              </Button>
            </Hide>
          </Stack>

          <Hide below={'sm'} asChild>
            <span className={styles.divider} />
          </Hide>

          {avtalerMedIsoGruppering.includes(agreement.id) ? (
            <PostsListIsoGroups posts={posts} postLoading={postsIsLoading} />
          ) : (
            <PostsList posts={posts} postLoading={postsIsLoading} />
          )}

          {postError && (
            <Alert variant="error" title="Error med lasting av produkter">
              Det har skjedd en feil ved innhenting av produkter. Vennligst prøv igjen senere.
            </Alert>
          )}

          {!postError && posts.length === 0 && (
            <Alert variant="info">Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</Alert>
          )}
        </VStack>
      </VStack>
    </>
  )
}

const TopBar = ({ agreement }: { agreement: Agreement }) => {
  return (
    <Bleed style={{ backgroundColor: '#F5F9FF' }} reflectivePadding marginInline={'full'}>
      <VStack gap="4" align={'start'} paddingBlock={'12'} maxWidth={'800px'}>
        <Heading level="1" size="xlarge" style={{ textWrap: 'balance' }}>
          {agreement.title}
        </Heading>

        <HStack gap={'2'} align={'center'}>
          <CalendarIcon aria-hidden width={'24px'} height={'24px'} />
          <BodyLong weight={'semibold'}>
            {dateToString(agreement.published)} - {dateToString(agreement.expired)}
          </BodyLong>
        </HStack>

        <HStack gap={'2'} align={'center'}>
          <DocPencilIcon aria-hidden width={'24px'} height={'24px'} />
          <BodyLong weight={'semibold'}>
            {agreement.reference.includes('og') ? agreement.reference : agreement.reference.replace(' ', ' og ')}
          </BodyLong>
        </HStack>

        <Button
          as={NextLink}
          href={`/rammeavtale/${agreement.id}`}
          icon={<ArrowRightIcon aria-hidden />}
          iconPosition={'right'}
          variant={'tertiary'}
          style={{ paddingBlock: '0 0.75rem', paddingInline: 0 }}
        >
          Les om avtalen
        </Button>

        <TopLinks agreementId={agreement.id} />
      </VStack>
    </Bleed>
  )
}

const TopLinks = ({ agreementId }: { agreementId: string }) => {
  const { toggles, isEnabled, isLoading } = useFeatureFlags()

  if (isLoading) {
    return (
      <HStack justify="center" style={{ marginTop: '28px' }}>
        <Loader size="xlarge" title="Laster..." />
      </HStack>
    )
  }

  const isHygieneAvtale =
    agreementId === '034fccf7-c481-4c2b-9867-4d092f89c0fe' || agreementId === '22469a9d-0cc2-41c4-8564-085b0d836144'

  const isLofteplattformAvtale =
    agreementId === '4432dc25-88c1-429e-95f3-0ed55836335e' || agreementId === '039c71d2-d325-47c0-99ec-8ac85748d40d'
  const isStaastativAvtale =
    agreementId === 'deec7554-2d7e-442f-a63f-1fda49ef77c7' || agreementId === '216b3d7b-ce74-4bf4-aeca-f06888f5c072'
  const isGanghjelpemidlerAvtale =
    agreementId === '35a25ae9-d307-42a6-8893-732de01e02ce' || agreementId === 'f1ddd971-17f1-4241-8593-edaf377f66f0'
  const isArbeidsstolAvtale =
    agreementId === 'b062ea46-9cec-4503-982c-943c1734120d' || agreementId === '26e60523-b4d8-4f82-a59e-2eadcc3829e3'
  const isOverflyttingAvtale =
    agreementId === 'a9f619de-1223-422f-828f-c6f380622a55' || agreementId === '02e30ace-82bc-426c-b2fc-5cc6b2c48a81'
  const isKalendereAvtale =
    agreementId === 'de45889f-e4cd-45a2-9b36-5652594e1fba' || agreementId === 'f1596dac-3898-434f-8a39-902f5fb307ac'
  const isKjoreramper =
    agreementId === '3ea91ddf-f8e1-4d2b-a4a7-e81fca132733' || agreementId === 'e86fd988-0381-4d0a-a027-7654e2d8dbab'
  const isMadrasserTrykkforebyggendeAvtale =
    agreementId === 'ff48ef4c-d450-4c0e-b99e-244ddecbfc59' || agreementId === '5b3b139e-4eec-4461-bade-18e41115b56d'
  const isSengerAvtale =
    agreementId === 'f38e94b6-ad85-4cf6-bc26-f14dff0f3e20' || agreementId === '61135e09-f6ba-44ba-8e0d-3994c2883f4c'
  const isOppreisingsstolerAvtale =
    agreementId === '01cd8127-5ef0-489a-aff9-9755b57da1e7' || agreementId === '2a800f62-ddaa-4a62-9aa1-e88395b59e3f'
  const isVarmehjelpemidlerAvtale =
    agreementId === '38a0c948-fb9f-4cbb-a8d1-de22ac158ea2' || agreementId === 'fa455679-8674-4083-8c1a-5284847b8d41'
  const isSitteputerAvtale = agreementId === '26542d09-61c1-49e6-80e8-eef6a9ea7faf'
  const isKommunikasjonsHjelpemidlerAvtale = agreementId === '1f74afc7-9740-41cc-8648-cd942c392d42'
  const isMRSAvtale =
    agreementId === '3a020eea-eec5-4ef4-80cc-66268a7a62a7' || agreementId === '3a020eea-eec5-4ef4-80cc-66268a7a62a7'
  const isHorselNyAvtale = agreementId === '47105bc7-10a2-48fc-9ff2-95d6e7bb6b96'
  const isERSAvtlale = agreementId === 'eba4bfad-9f35-44c8-872a-d9f8583fa95f'
  const isModuloppbygdeSittesystemer = agreementId === '89c83362-13eb-43ab-80f0-99673f9b7a71'
  const isOverflyttingsplattformerPersonloftere = agreementId === '611b16c1-0e30-4093-851e-b6a5537cfc3e'
  const isVarslingsAvtale = agreementId === '7ef2ab32-34bd-4eec-92a8-2b5c47b77c78'
  const isSportsAvtale = agreementId === 'f74f9396-6305-4d3d-83d0-01a797d94e14'
  const isKjøreposeRegncapeAvtale =
    agreementId === '90c59ae1-033f-435e-bb06-f8a3f81cdd99' || agreementId === '7f6e11d4-b807-4bff-94cf-b0b0701654e8'
  const isElektriskHev = agreementId === 'ba893618-8010-40b2-9a14-f89c199e32d6'
  const isPersonlofterAvtale = agreementId === '51b2817e-774f-4361-9ee0-bdfaeea6dd6e'
  const isSyklerAvtale = agreementId === 'd8b40d10-2834-4962-a061-5b2f4acbb766'

  const showAccessoriesAndSparePartsButtons = !isKjøreposeRegncapeAvtale

  const showAccessoriesAndSparePartsList =
    isEnabled('finnhjelpemiddel.vis-tilbehor-og-reservedel-lister') &&
    (isLofteplattformAvtale ||
      isStaastativAvtale ||
      isGanghjelpemidlerAvtale ||
      isArbeidsstolAvtale ||
      isOverflyttingAvtale ||
      isKalendereAvtale ||
      isKjoreramper ||
      isMadrasserTrykkforebyggendeAvtale ||
      isSengerAvtale ||
      isOppreisingsstolerAvtale ||
      isVarmehjelpemidlerAvtale ||
      isSitteputerAvtale ||
      isKommunikasjonsHjelpemidlerAvtale ||
      isMRSAvtale ||
      isHorselNyAvtale ||
      isERSAvtlale ||
      isModuloppbygdeSittesystemer ||
      isOverflyttingsplattformerPersonloftere ||
      isVarslingsAvtale ||
      isSportsAvtale ||
      isElektriskHev ||
      isPersonlofterAvtale ||
      isSyklerAvtale)

  return (
    showAccessoriesAndSparePartsButtons && (
      <Button
        as={NextLink}
        href={`/rammeavtale/${agreementId}/deler`}
        icon={<LayersPlusIcon aria-hidden />}
        variant={'secondary'}
        className={styles.bleedButton}
      >
        Tilbehør og reservedeler
      </Button>
    )
  )
}

export default AgreementPage
