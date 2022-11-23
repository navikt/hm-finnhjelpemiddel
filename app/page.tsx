'use client'
import { useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { BodyShort, Select, Heading, Loader, Button } from '@navikt/ds-react'
import { fetchProdukter, FetchResponse, PAGE_SIZE, SearchData } from '../utils/api-util'

import Produkt from './Produkt'
import Sidebar from './Sidebar'

import './sok.scss'

export default function Page() {
  const [searchData, setSearchData] = useState<SearchData>({ searchTerm: '', isoCode: '' })
  const { data, size, setSize } = useSWRInfinite<FetchResponse>(
    (index) => ({ url: `/product/_search`, pageIndex: index, searchData }),
    fetchProdukter
  )

  const produkter = data?.flatMap((d) => d.produkter)

  const isLoading = !data || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isLastPage = data && data[data.length - 1]?.produkter.length < PAGE_SIZE

  return (
    <div className="flex-wrapper">
      <Sidebar searchData={searchData} setSearchData={setSearchData} />
      <div className="results__wrapper">
        {!data && <Loader className="results__loader" size="3xlarge" title="Laster produkter" />}
        {data && (
          <>
            <header className="results__header">
              <div>
                <Heading level="2" size="medium">
                  Søkeresultater
                </Heading>
                <BodyShort>
                  {produkter?.length
                    ? `${produkter.length} av ${data?.at(0)?.antallProdukter} produkter vises`
                    : 'Ingen produkter funnet'}
                </BodyShort>
              </div>
              <Select label="Sortering" hideLabel={false} size="small" className="results__sort-select">
                <option value="">Alfabetisk</option>
              </Select>
            </header>
            <ol className="results__list">
              {produkter?.map((produkt) => (
                <Produkt key={produkt.id} produkt={produkt} paaRammeavtale={false} />
              ))}
            </ol>
            {!isLastPage ? (
              <Button variant="secondary" onClick={() => setSize(size + 1)} loading={isLoading}>
                Vis flere treff
              </Button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
