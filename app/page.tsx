'use client'
import useSWRInfinite from 'swr/infinite'
import { BodyShort, Heading, Loader, Button, Alert } from '@navikt/ds-react'
import { fetchProducts, FetchResponse, PAGE_SIZE } from '../utils/api-util'
import { Product } from '../utils/product-util'

import SearchResult from './SearchResult'
import Sidebar from './Sidebar'

import './search.scss'
import { useSearchDataStore, useProducCompareDataStore } from '../utils/state-util'
import { PageWrapper } from './page-wrapper'
import { motion } from 'framer-motion'
import { useState } from 'react'

const variantsComparingSummary = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
      restDelta: 2,
    },
  },
  closed: {
    opacity: 0.5,
    y: 200,
    delay: 0.5,
    type: 'spring',
    stiffness: 400,
    damping: 40,
  },
}

export default function Page() {
  const { searchData } = useSearchDataStore()
  const { productsToCompare } = useProducCompareDataStore()
  const [isOpen, setIsOpen] = useState(productsToCompare.length > 0 ? true : false)

  const { data, size, setSize, isLoading } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProducts,
    {
      keepPreviousData: true,
    }
  )

  return (
    <PageWrapper>
      <motion.div
        animate={isOpen ? 'open' : 'closed'}
        variants={variantsComparingSummary}
        className="products-to-compare products-to-compare__container"
      >
        <div className="products-to-compare__content">
          <Heading level="2" size="medium">
            Sammenlikn følgende produkter
          </Heading>
          <div className="products-to-compare__product">Produkt 1</div>
          <div className="products-to-compare__product">Produkt 2</div>
          <div className="products-to-compare__product">Produkt 3</div>
        </div>
      </motion.div>
      <div className="main-wrapper">
        <div className="flex-column-wrap">
          <Sidebar />
          <div className="results__wrapper">
            <SearchResults
              data={data}
              size={size}
              setSize={setSize}
              comaparingIsOpen={isOpen}
              setComparingIsOpen={setIsOpen}
              isLoading={isLoading}
            />
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
  comaparingIsOpen,
  setComparingIsOpen,
  isLoading,
}: {
  size: number
  setSize: (size: number) => void
  comaparingIsOpen: boolean
  setComparingIsOpen: (isOpen: boolean) => void
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
          <Button variant="secondary" onClick={() => setComparingIsOpen(!comaparingIsOpen)}>
            Sammenlikn produkter
          </Button>
        </div>
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
