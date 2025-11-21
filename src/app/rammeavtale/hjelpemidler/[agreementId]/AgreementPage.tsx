'use client'

import { FilterData, getFiltersAgreement, getProductsOnAgreement } from '@/utils/api-util'
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import CompareMenu from '@/components/layout/CompareMenu'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { Agreement, mapAgreementProducts } from '@/utils/agreement-util'
import { mapSearchParams } from '@/utils/mapSearchParams'
import { PostBucketResponse, ProductSourceResponse } from '@/utils/response-types'
import { dateToString } from '@/utils/string-util'
import { ArrowRightIcon, CalendarIcon, DocPencilIcon, FilePdfIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import { Alert, Bleed, BodyLong, Button, Heading, Hide, HStack, Loader, Stack, VStack } from '@navikt/ds-react'
import AgreementPrintableVersion from './AgreementPrintableVersion'
import FilterForm, { AgreementFilters } from './FilterForm'
import PostsList from './PostsList'
import PostsListIsoGroups from '@/app/rammeavtale/hjelpemidler/[agreementId]/PostsListIsoGroups'
import NextLink from 'next/link'
import styles from '@/app/rammeavtale/AgreementPage.module.scss'
import useSWRImmutable from 'swr/immutable'
import useQueryString from '@/utils/search-params-util'
import { PostsListKomponenttypeGroups } from '@/app/rammeavtale/hjelpemidler/[agreementId]/PostsListKomponenttypeGroups'

const AgreementPage = ({ agreement }: { agreement: Agreement }) => {
  const { isEnabled, isLoading } = useFeatureFlags()

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

  const avtalerMedKomponenttypeGruppering = ['7ef2ab32-34bd-4eec-92a8-2b5c47b77c78']

  //Rammeavtaler som er splittet i to og har mange tomme delkontrakter
  const splitAgreementsWithEmptyPosts = [
    'de5cce52-cd91-469e-82a1-4ca0d3bc79d4', // Synstekniske hjelpemidler - digitale luper og lesetv
    '9d9a0fbb-c06a-4662-ab08-b1e470ea8b74', // Hygiene - toalettløsninger med spyle- og tørkefunksjon og toalettarmstøtter med ben
    'dcbfde73-c72e-4af0-aebf-12884168ce4d', // Hygienehjelpemidler og støttestang
  ]

  const {
    data: postBuckets,
    isLoading: postsIsLoading,
    error: postError,
  } = useSWR<PostBucketResponse[]>({ agreementId: agreement.id, searchData: searchData }, getProductsOnAgreement, {
    keepPreviousData: true,
  })

  const { data: unfilteredPostBuckets } = useSWR<PostBucketResponse[]>(
    { agreementId: agreement.id, searchData: mapSearchParams(new ReadonlyURLSearchParams()) },
    getProductsOnAgreement,
    {
      keepPreviousData: true,
    }
  )

  const { data: filtersFromData } = useSWRImmutable<FilterData>(
    { agreementId: agreement.id, type: 'filterdata' },
    getFiltersAgreement,
    {
      keepPreviousData: true,
    }
  )

  if (!postBuckets || !unfilteredPostBuckets || !filtersFromData) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Loader size="3xlarge" title="Laster produkter" />
      </HStack>
    )
  }

  const postsContainingProducts = new Set(
    unfilteredPostBuckets
      .flatMap((bucket) => bucket.products.flatMap((hit) => (hit._source as ProductSourceResponse).agreements))
      .map((agreement) => agreement.postIdentifier)
  )

  const postFilters = agreement.posts
    .filter((post) => post.nr != 99 && post.title.length > 0)
    .filter(
      //Skjul tomme delkontrakter for rammeavtalene i listen splitAgreementsWithEmptyPosts
      (post) => !splitAgreementsWithEmptyPosts.includes(agreement.id) || postsContainingProducts.has(post.identifier)
    )
    .sort((a, b) => a.nr - b.nr)
    .map((post) => post.title)

  const leverandorFilter = filtersFromData?.leverandor?.values?.map((value) => value.key.toString()) ?? []

  const filters: AgreementFilters = {
    leverandor: leverandorFilter,
    delkontrakt: postFilters,
  }
  
  const posts = mapAgreementProducts(postBuckets, agreement, searchData.filters).filter(
    (post) => !splitAgreementsWithEmptyPosts.includes(agreement.id) || post.products.length > 0
  )

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
            {filters.delkontrakt.length > 0 && filters.leverandor.length > 0 && (
              <FilterForm filters={filters} onChange={onChange} />
            )}

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

          {isEnabled('finnhjelpemiddel.avtale-side.komponenttype-gruppering') ? (
            avtalerMedIsoGruppering.includes(agreement.id) ? (
              <PostsListIsoGroups posts={posts} postLoading={postsIsLoading} />
            ) : avtalerMedKomponenttypeGruppering.includes(agreement.id) ? (
              <PostsListKomponenttypeGroups posts={posts} postLoading={postsIsLoading} />
            ) : (
              <PostsList posts={posts} postLoading={postsIsLoading} />
            )
          ) : avtalerMedIsoGruppering.includes(agreement.id) ? (
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

  const isKjøreposeRegncapeAvtale =
    agreementId === '90c59ae1-033f-435e-bb06-f8a3f81cdd99' || agreementId === '7f6e11d4-b807-4bff-94cf-b0b0701654e8'
  const isSeksualtekniskAvtale = agreementId === '768b68d7-9e3a-4865-983e-09b47ecc6a2c'

  const showAccessoriesAndSparePartsButtons = !isKjøreposeRegncapeAvtale && !isSeksualtekniskAvtale

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
