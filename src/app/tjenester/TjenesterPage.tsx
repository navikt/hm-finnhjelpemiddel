'use client'

import { Bleed, BodyLong, Box, Button, Heading, Hide, Pagination, Show, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { fetchTjenesterForAgreement } from '@/utils/api-util'
import useSWRImmutable from 'swr/immutable'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import useQueryString from '@/utils/search-params-util'
import { useEffect, useState } from 'react'
import { ChevronLeftIcon } from '@navikt/aksel-icons'
import styles from './TjenesterPage.module.scss'
import { TjenesterTable } from '@/app/tjenester/TjenesterTable'
import { TjenesterSearchBar } from '@/app/tjenester/TjenesterSearchBar'

type TjenesterPageProps = {
  agreementId: string
  backLink: string
  isAgreement: boolean
  title: string
}
export const TjenesterPage = ({ agreementId, backLink, title }: TjenesterPageProps) => {
  const searchParams = useSearchParams()
  const rowsPerPage = 16
  const router = useRouter()
  const pathname = usePathname()
  const { createQueryStringMultiple, searchParamKeys } = useQueryString()

  const [page, setPage] = useState<number>(() => parseInt(searchParams.get(searchParamKeys.page) ?? '1') || 1)

  const showSupplierSelect = true

  useEffect(() => {
    const newPage = parseInt(searchParams.get(searchParamKeys.page) ?? '1') || 1
    if (newPage !== page) setPage(newPage)
  }, [page, searchParams, searchParamKeys.page])

  const pageCount = (allItems: number) => {
    const number = Math.ceil(allItems / rowsPerPage)
    return number <= 0 ? 1 : number
  }

  const handleSetPage = (newPage: number) => {
    setPage(newPage)
    const pageParam = createQueryStringMultiple({ name: searchParamKeys.page, value: newPage.toString() })
    router.push(`${pathname}?${pageParam}`, { scroll: false })
  }

  const { data: tjenesterData } = useSWRImmutable(
    'tjenester' +
      agreementId +
      searchParams.get(searchParamKeys.searchTerm) +
      searchParams.get(searchParamKeys.supplier) +
      page,
    () =>
      fetchTjenesterForAgreement({
        searchTerm: searchParams.get(searchParamKeys.searchTerm) ?? '',
        pageSize: rowsPerPage,
        currentPage: page || 1,
        agreementId: agreementId,
        selectedSupplier: searchParams.get(searchParamKeys.supplier) ?? undefined,
      }),
    { keepPreviousData: true }
  )

  return (
    <Box className={styles.container}>
      <VStack gap="space-16" className="main-wrapper--large">
        <Bleed style={{ backgroundColor: '#F5F9FF' }} reflectivePadding marginInline={'full'}>
          <VStack gap={"space-36"} paddingBlock={"space-24"} align={'start'}>
            <Button
              as={NextLink}
              href={backLink}
              variant={'tertiary'}
              icon={<ChevronLeftIcon aria-hidden />}
              style={{ padding: 0 }}
            >
              {`Tilbake`}
            </Button>
            <VStack gap={"space-16"}>
              <Heading level="1" size="medium">
                Tjenester
              </Heading>
              <BodyLong weight={'semibold'}>
                Her finner du tjenester til {title}
              </BodyLong>
            </VStack>
          </VStack>
        </Bleed>
        <TjenesterSearchBar id={agreementId} showSupplierSelect={showSupplierSelect} />

        {tjenesterData && (
          <VStack gap={"space-16"} paddingBlock="space-16">
            <TjenesterTable tjenester={tjenesterData?.servicejobs} />
            {tjenesterData?.totalHits > 0 && pageCount(tjenesterData?.totalHits) > 1 && (
              <ResponsivePagination page={page} count={pageCount(tjenesterData?.totalHits)} setPage={handleSetPage} />
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

type ResponsivePaginationProps = {
  page: number
  count: number
  setPage: (value: number) => void
}
const ResponsivePagination = ({ page, count, setPage }: ResponsivePaginationProps) => {
  return (
    <>
      <Hide below={'md'} asChild>
        <Pagination
          page={page}
          count={count}
          size={'medium'}
          onPageChange={setPage}
          prevNextTexts
          srHeading={{
            tag: 'h2',
            text: 'Tabellpaginering tjenester',
          }}
        />
      </Hide>
      <Show below={'md'} asChild>
        <Pagination
          page={page}
          count={count}
          size={'medium'}
          onPageChange={setPage}
          siblingCount={0}
          boundaryCount={0}
          srHeading={{
            tag: 'h2',
            text: 'Tabellpaginering tjenester',
          }}
        />
      </Show>
    </>
  )
}
