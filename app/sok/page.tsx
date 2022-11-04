'use client'
import { useEffect, useState } from 'react'
import { NextPage } from 'next/types'
import useSWR from 'swr'
import { BodyShort, Search, Select, Heading, Pagination } from '@navikt/ds-react'
import { calculateNextAvailableIsoCategory } from '../../utils/isoCategory'
import { fetchProdukter, FetchResponse } from './api'
import Produkt from './Produkt'

const SokPage: NextPage<{}> = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const pageIndex = pageNumber - 1

  const { data } = useSWR<FetchResponse>({ url: `/product/_search`, pageIndex }, fetchProdukter)
  const [selectedIsocode, setSelectedIsocode] = useState<string>('')
  const levels = selectedIsocode.length / 2 + 1

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className="flex-wrapper">
      <div className="search__side-bar">
        <form>
          <Heading level="2" size="medium">
            Søk
          </Heading>
          <Search label="Søk artikler" variant="primary" role="search" size="small" className="search__input-field" />
          {[...Array(levels).keys()].map((i) => {
            const nextCategories = calculateNextAvailableIsoCategory(selectedIsocode, i)
            return (
              nextCategories.length > 0 && (
                <Select label={'Velg kategori ' + (i + 1)} onChange={(e) => setSelectedIsocode(e.target.value)} key={i}>
                  <option value="">Velg kategori</option>
                  {nextCategories.map(([isoCode, title]) => (
                    <option key={isoCode} value={isoCode}>
                      {title}
                    </option>
                  ))}
                </Select>
              )
            )
          })}
        </form>
      </div>
      <div className="results__wrapper">
        <header className="results__header">
          <div>
            <Heading level="2" size="medium">
              Søkeresultat
            </Heading>
            <BodyShort>x av y antall produkter vises</BodyShort>
          </div>
          <Select label="Sortér etter" hideLabel={false} className="results__sort-select" size="small">
            <option value="">Alfabetisk</option>
          </Select>
        </header>
        <ol className="results__list">
          {data?.produkter.map((produkt) => (
            <Produkt
              key={produkt?.id}
              artikkelId={'artikkel'}
              artikkelnavn={produkt?.id.toString()}
              paaRammeavtale={false}
            />
          ))}
        </ol>
        <Pagination
          page={pageNumber}
          onPageChange={(x) => setPageNumber(x)}
          count={100}
          boundaryCount={1}
          siblingCount={3}
        />
      </div>
    </div>
  )
}

export default SokPage
