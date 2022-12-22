'use client'
import useSWRInfinite from 'swr/infinite'
import { BodyShort, Heading, Loader, Button, Alert } from '@navikt/ds-react'
import { fetchProducts, FetchResponse, PAGE_SIZE } from '../utils/api-util'
import { Product as ProductType } from '../utils/product-util'

import Produkt from './Produkt'
import Sidebar from './Sidebar'

import './search.scss'
import { useSearchDataStore } from '../utils/state-util'

export default function Page() {
  const { searchData } = useSearchDataStore()

  const { data, size, setSize } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  const products = data?.flatMap((d) => d.products)

  const isLoading = !data || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isLastPage = data && data[data.length - 1]?.products.length < PAGE_SIZE

  const SearchResults = ({ products }: { products: Array<ProductType> | undefined }) => {
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
          {products.map((produkt) => (
            <Produkt key={produkt.id} produkt={produkt} paaRammeavtale={false} />
          ))}
        </ol>
        {!isLastPage ? (
          <Button variant="secondary" onClick={() => setSize(size + 1)} loading={isLoading}>
            Vis flere treff
          </Button>
        ) : null}
      </>
    )
  }

  return (
    <div className="main-wrapper">
      <Sidebar />
      <div className="results__wrapper">
        {!data && <Loader className="results__loader" size="3xlarge" title="Laster produkter" />}
        {data && <SearchResults products={products} />}
      </div>
    </div>
  )
}
