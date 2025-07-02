'use client'

import { BodyShort, Heading, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import { PartsSearchBar } from '@/app/deler/PartsSearchBar'
import { PartsTabs, ProductTabs } from '@/app/deler/PartsTabs'
import { fetchParts } from '@/utils/api-util'
import useSWRImmutable from 'swr/immutable'
import { useSearchParams } from 'next/navigation'
import useQueryString from '@/utils/search-params-util'
import { useEffect, useState } from 'react'

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
    <div className="main-wrapper--large spacing-vertical--small">
      <VStack gap="4">
        <Link as={NextLink} href={backLink} variant="subtle">
          {`Tilbake`}
        </Link>
        <Heading level="1" size="medium">
          Tilbehør og reservedeler
        </Heading>
        <BodyShort>Her finner du deler til {title}</BodyShort>

        <PartsSearchBar id={id} showSupplierSelect={showSupplierSelect} />

        {accessoriesData && sparePartsData && (
          <PartsTabs sparePartsData={sparePartsData} accessoriesData={accessoriesData} />
        )}
      </VStack>
    </div>
  )
}
