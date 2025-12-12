'use client'

import { Box, Hide, Pagination, Show, Tabs, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PackageIcon, WrenchIcon } from '@navikt/aksel-icons'
import { PartsTable } from './PartsTable'
import useQueryString from '@/utils/search-params-util'
import { ProductVariantsPagination } from '@/utils/api-util'

export enum ProductTabs {
  ACCESSORIES = 'ACCESSORIES',
  SPAREPART = 'SPAREPART',
}

type PartsTabsProps = {
  accessoriesData: ProductVariantsPagination
  sparePartsData: ProductVariantsPagination
}

export const PartsTabs = ({ accessoriesData, sparePartsData }: PartsTabsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { createQueryStringMultiple, searchParamKeys } = useQueryString()

  const rowsPerPage = 16
  const [page, setPage] = useState<number>(parseInt(searchParams.get(searchParamKeys.page) ?? '1') || 1)

  const [selectedTab, setSelectedTab] = useState<ProductTabs>(
    (searchParams.get(searchParamKeys.tab) as ProductTabs) || getDefaultTab(accessoriesData)
  )

  useEffect(() => {
    const newPage = parseInt(searchParams.get(searchParamKeys.page) ?? '1')
    if (newPage !== page) setPage(newPage)
  }, [page, searchParams, searchParamKeys.page])

  const handleSetPage = (newPage: number) => {
    setPage(newPage)
    const pageParam = createQueryStringMultiple({ name: searchParamKeys.page, value: newPage.toString() })
    router.push(`${pathname}?${pageParam}`, { scroll: false })
  }

  const handleTabChange = (tab: ProductTabs) => {
    setSelectedTab(tab)
    setPage(1)
    const newParams = createQueryStringMultiple(
      { name: searchParamKeys.tab, value: tab },
      {
        name: searchParamKeys.page,
        value: '1',
      }
    )
    router.push(`${pathname}?${newParams}`, { scroll: false })
  }

  const pageCount = (allItems: number) => {
    const number = Math.ceil(allItems / rowsPerPage)
    return number <= 0 ? 1 : number
  }

  return (
    <Box paddingBlock="4">
      <Tabs value={selectedTab} onChange={(value) => handleTabChange(value as ProductTabs)}>
        <Tabs.List>
          <Tabs.Tab
            value={ProductTabs.ACCESSORIES}
            label={`Tilbehør (${accessoriesData?.totalHits}) `}
            icon={<PackageIcon color="#000" fontSize="1.5rem" aria-hidden />}
          />
          <Tabs.Tab
            value={ProductTabs.SPAREPART}
            label={`Reservedeler (${sparePartsData?.totalHits}) `}
            icon={<WrenchIcon color="#000" fontSize="1.5rem" aria-hidden />}
          />
        </Tabs.List>
        <Tabs.Panel value={ProductTabs.ACCESSORIES}>
          <VStack gap={'4'} paddingBlock="4">
            <PartsTable products={accessoriesData?.products} />
            {accessoriesData?.totalHits > 0 && pageCount(accessoriesData?.totalHits) > 1 && (
              <ResponsivePagination page={page} count={pageCount(accessoriesData?.totalHits)} setPage={handleSetPage} />
            )}
          </VStack>
        </Tabs.Panel>
        <Tabs.Panel value={ProductTabs.SPAREPART}>
          <VStack gap={'4'} paddingBlock="4">
            <PartsTable products={sparePartsData?.products} />
            {sparePartsData?.totalHits > 0 && pageCount(sparePartsData?.totalHits) > 1 && (
              <ResponsivePagination page={page} count={pageCount(sparePartsData?.totalHits)} setPage={handleSetPage} />
            )}
          </VStack>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
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
            text: 'Tabellpaginering reservedeler',
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
            text: 'Tabellpaginering reservedeler',
          }}
        />
      </Show>
    </>
  )
}

function getDefaultTab(accessoriesData: ProductVariantsPagination): ProductTabs {
  if (!accessoriesData?.totalHits) {
    return ProductTabs.SPAREPART
  }
  return ProductTabs.ACCESSORIES
}
