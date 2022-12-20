'use client'
import useSWRInfinite from 'swr/infinite'
import { BodyShort, Select, Heading, Loader, Button, Alert } from '@navikt/ds-react'
import { fetchProdukter, FetchResponse, PAGE_SIZE } from '../utils/api-util'
import { Produkt as ProduktType } from '../utils/produkt-util'

import Produkt from './Produkt'
import Sidebar from './Sidebar'

import './sok.scss'
import { useSearchDataStore } from '../utils/state-util'

export default function Page() {
  const { searchData } = useSearchDataStore()

  const { data, size, setSize } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProdukter,
    {
      keepPreviousData: true,
    }
  )

  const produkter = data?.flatMap((d) => d.produkter)

  const isLoading = !data || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isLastPage = data && data[data.length - 1]?.produkter.length < PAGE_SIZE

  const Sokeresultater = ({ produkter }: { produkter: Array<ProduktType> | undefined }) => {
    if (!produkter?.length) {
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
            <BodyShort>{`${produkter.length} av ${data?.at(-1)?.antallProdukter} produkter vises`}</BodyShort>
          </div>
          <Select label="Sortering" hideLabel={false} size="small" className="results__sort-select">
            <option value="">Alfabetisk</option>
          </Select>
        </header>
        <ol className="results__list">
          {produkter.map((produkt) => (
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
        {data && <Sokeresultater produkter={produkter} />}
      </div>
    </div>
  )
}
