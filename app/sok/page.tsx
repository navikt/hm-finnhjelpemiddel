'use client'
import { useEffect, useState } from 'react'
import { NextPage } from 'next/types'
import useSWR from 'swr'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { BodyShort, Search, Select, Heading, Pagination, Loader, TextField } from '@navikt/ds-react'
import { fetchProdukter, FetchResponse } from './api'

import Kategorivelger from './Kategorivelger'
import Produkt from './Produkt'

import './sok.scss'

type SearchFormInputs = {
  searchTerm: string
}

const SokPage: NextPage = () => {
  const { control, handleSubmit } = useForm<SearchFormInputs>()
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedIsoCode, setSelectedIsoCode] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const pageIndex = pageNumber - 1
  const pageSize = 15
  const { data } = useSWR<FetchResponse>(
    { url: `/product/_search`, pageIndex, pageSize, searchTerm, isoFilter: selectedIsoCode },
    fetchProdukter
  )
  const paginationCount = Math.ceil((data?.antallProdukter || 1) / pageSize)

  useEffect(() => {
    console.log(data)
  }, [data])

  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => setSearchTerm(data.searchTerm)

  return (
    <div className="flex-wrapper">
      <div className="search__side-bar">
        <form role="search" onClick={handleSubmit(onSubmit)}>
          <Heading level="2" size="medium">
            Søk
          </Heading>
          <Controller
            render={({ field }) => (
              <Search
                label="Søk i artikler"
                variant="secondary"
                hideLabel={false}
                className="search__input"
                {...field}
              />
            )}
            name="searchTerm"
            control={control}
            defaultValue=""
          />
          <Kategorivelger selectedIsoCode={selectedIsoCode} setSelectedIsoCode={setSelectedIsoCode} />
        </form>
      </div>

      <div className="results__wrapper">
        {!data && <Loader size="3xlarge" title="Laster produkter" />}

        {data && (
          <>
            <header className="results__header">
              <div>
                <Heading level="2" size="medium">
                  Søkeresultat
                </Heading>
                <BodyShort>
                  {data.produkter.length
                    ? `${data?.produkter.length} av ${data?.antallProdukter} produkter vises`
                    : 'Ingen produkter funnet'}
                </BodyShort>
              </div>
              <Select label="Sortering" hideLabel={false} size="small" className="results__sort-select">
                <option value="">Alfabetisk</option>
              </Select>
            </header>
            <ol className="results__list">
              {data?.produkter.map((produkt) => (
                <Produkt key={produkt.id} produkt={produkt} paaRammeavtale={false} />
              ))}
            </ol>
            {paginationCount > 1 && (
              <Pagination
                page={pageNumber}
                onPageChange={(x) => setPageNumber(x)}
                count={paginationCount}
                boundaryCount={1}
                siblingCount={1}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SokPage
