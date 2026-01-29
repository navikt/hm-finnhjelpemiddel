'use client'

import { Bleed, BodyLong, Box, Button, Heading, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { PartsSearchBar } from '@/app/deler/PartsSearchBar'
import { PartsTabs, ProductTabs } from '@/app/deler/PartsTabs'
import { fetchParts } from '@/utils/api-util'
import useSWRImmutable from 'swr/immutable'
import { useSearchParams } from 'next/navigation'
import useQueryString from '@/utils/search-params-util'
import { useEffect, useState } from 'react'
import { ChevronLeftIcon } from '@navikt/aksel-icons'
import styles from './PartsPage.module.scss'

type PartsPageProps = {
  id: string
  backLink: string
  isAgreement: boolean
  title: string
}
export const PartsPage = ({ id, backLink, isAgreement, title }: PartsPageProps) => {
  const searchParams = useSearchParams()
  const { searchParamKeys } = useQueryString()
  const searchTermValue = searchParams.get(searchParamKeys.searchTerm) || ''
  const selectedSupplierValue = searchParams.get(searchParamKeys.supplier) || ''
  const selectedTab = (searchParams.get(searchParamKeys.tab) as ProductTabs) || ProductTabs.ACCESSORIES
  const rowsPerPage = 16
  const [page, setPage] = useState<number>(parseInt(searchParams.get(searchParamKeys.page) ?? '1') || 1)

  const showSupplierSelect = isAgreement

  useEffect(() => {
    const newPage = parseInt(searchParams.get(searchParamKeys.page) ?? '1')
    if (newPage !== page) setPage(newPage)
  }, [page, searchParams, searchParamKeys.page])

  const { data: sparePartsData } = useSWRImmutable(
    'spareParts' +
      id +
      searchParams.get(searchParamKeys.searchTerm) +
      searchParams.get(searchParamKeys.supplier) +
      (selectedTab === ProductTabs.SPAREPART ? page : ''),
    () =>
      fetchParts({
        searchTerm: searchTermValue,
        pageSize: rowsPerPage,
        currentPage: page,
        id: id,
        isAgreement: isAgreement,
        spareParts: true,
        selectedSupplier: selectedSupplierValue,
      }),
    { keepPreviousData: true }
  )
  const { data: accessoriesData } = useSWRImmutable(
    'accessories' +
      id +
      searchParams.get(searchParamKeys.searchTerm) +
      searchParams.get(searchParamKeys.supplier) +
      (selectedTab === ProductTabs.ACCESSORIES ? page : ''),
    () =>
      fetchParts({
        searchTerm: searchTermValue,
        pageSize: rowsPerPage,
        currentPage: page,
        id: id,
        isAgreement: isAgreement,
        accessories: true,
        selectedSupplier: selectedSupplierValue,
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
                Tilbehør og reservedeler
              </Heading>
              <BodyLong weight={'semibold'}>
                Her finner du deler til {title}
              </BodyLong>
            </VStack>
          </VStack>
        </Bleed>
        <PartsSearchBar id={id} showSupplierSelect={showSupplierSelect} />

        {accessoriesData && sparePartsData && (
          <PartsTabs sparePartsData={sparePartsData} accessoriesData={accessoriesData} />
        )}
      </VStack>
    </Box>
  );
}
