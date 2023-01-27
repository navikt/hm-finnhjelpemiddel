'use client'
import useSWRInfinite from 'swr/infinite'
import { BodyShort, Heading, Loader, Button, Alert } from '@navikt/ds-react'
import { fetchProducts, FetchResponse, PAGE_SIZE } from '../utils/api-util'
import { AnimatePresence, motion } from 'framer-motion'

import SearchResult from './SearchResult'
import Sidebar from './Sidebar'
import CompareMenu from './CompareMenu'

import './search.scss'
import { useSearchDataStore, useHydratedCompareStore, CompareMode, CompareMenuState } from '../utils/state-util'
import { PageWrapper } from './animate-page-wrapper'

export default function Page() {
  const { searchData } = useSearchDataStore()
  const { compareMode } = useHydratedCompareStore()

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  return (
    <PageWrapper>
      {compareMode === CompareMode.Active && <CompareMenu />}
      <div className="main-wrapper">
        <div className="flex-column-wrap">
          <Sidebar filters={data?.at(-1)?.filters} />
          <div className="results__wrapper">
            {!data && <Loader className="results__loader" size="3xlarge" title="Laster produkter" />}
            {data && <SearchResults data={data} size={size} setSize={setSize} isLoading={isLoading} />}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

const SearchResults = ({
  data,
  size,
  setSize,
  isLoading,
}: {
  size: number
  setSize: (size: number) => void
  isLoading: boolean
  data?: Array<FetchResponse>
}) => {
  const { setCompareMode, compareMode, setCompareMenuState } = useHydratedCompareStore()
  const products = data?.flatMap((d) => d.products)
  const isLoadingMore = !data || (size > 0 && typeof data[size - 1] === 'undefined')
  const isLastPage = data && data[data.length - 1]?.products.length < PAGE_SIZE

  const comparingButton =
    compareMode === CompareMode.Deactivated ? (
      <Button
        variant="secondary"
        onClick={() => {
          setCompareMode(CompareMode.Active), setCompareMenuState(CompareMenuState.Open)
        }}
      >
        Sammenlign produkter
      </Button>
    ) : (
      <Button variant="secondary" onClick={() => setCompareMode(CompareMode.Deactivated)}>
        Slå av sammenligning av produkter
      </Button>
    )

  if (isLoading) {
    return <Loader className="results__loader" size="3xlarge" title="Laster produkter" />
  }

  if (!products?.length) {
    return (
      <>
        <Heading level="2" size="medium">
          Søkeresultater
        </Heading>
        <Alert variant="info" fullWidth>
          Ingen produkter funnet.
        </Alert>
      </>
    )
  }
  return (
    <>
      <header className="results__header">
        <div>
          <Heading level="2" size="medium">
            Søkeresultater
          </Heading>
          <BodyShort>{`${products.length} av ${data?.at(-1)?.numberOfProducts} produkter vises`}</BodyShort>
        </div>
        {comparingButton}
      </header>
      <ol className="results__list">
        {products.map((product) => (
          <SearchResult key={product.id} product={product} />
        ))}
      </ol>
      {!isLastPage && (
        <Button variant="secondary" onClick={() => setSize(size + 1)} loading={isLoadingMore}>
          Vis flere treff
        </Button>
      )}
    </>
  )
}
