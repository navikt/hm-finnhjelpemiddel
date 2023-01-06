'use client'
import useSWRInfinite from 'swr/infinite'
import { BodyShort, Heading, Loader, Button, Alert, LinkPanel } from '@navikt/ds-react'
import { fetchProducts, FetchResponse, PAGE_SIZE } from '../utils/api-util'
import { useSearchDataStore } from '../utils/state-util'

import SearchResult from './SearchResult'
import Sidebar from './Sidebar'

import './search.scss'

export default function Page() {
  const { searchData } = useSearchDataStore()

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  return (
    <div className="main-wrapper">
      <Sidebar />
      <div className="results__wrapper">
        <SearchResults data={data} size={size} setSize={setSize} isLoading={isLoading} />
      </div>
    </div>
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
  const products = data?.flatMap((d) => d.products)
  const isLoadingMore = !data || (size > 0 && typeof data[size - 1] === 'undefined')
  const isLastPage = data && data[data.length - 1]?.products.length < PAGE_SIZE

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
        {/*<Select label="Sortering" hideLabel={false} size="small" className="results__sort-select">*/}
        {/*  <option value="">Alfabetisk</option>*/}
        {/*</Select>*/}
      </header>
      <ol className="results__list">
        {products.map((product) => (
          <SearchResult key={product.id} product={product} />
        ))}
      </ol>
      {!isLastPage ? (
        <Button variant="secondary" onClick={() => setSize(size + 1)} loading={isLoadingMore}>
          Vis flere treff
        </Button>
      ) : null}
    </>
  )
}
