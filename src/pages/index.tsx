import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import { Heading, Search } from '@navikt/ds-react'

import { SearchData } from '@/utils/api-util'
import { mapProductSearchParams } from '@/utils/product-util'
import { initialSearchDataState } from '@/utils/search-state-util'

function Home() {
  const router = useRouter()

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    router.push('/sok?term=' + data.searchTerm)
  }
  const [productSearchParams] = useState(mapProductSearchParams(router.query))
  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })
  const { control, handleSubmit } = formMethods

  return (
    <>
      <div className="searchbar">
        <div className="searchbar__heading">
          {/*Alt* av hjelpemidler samlet på en plass*/}
          <Heading level="1" size="large">
            Lett å finne frem til informasjon om hjelpemidler!
          </Heading>
        </div>
        <div className="searchbar__input">
          <FormProvider {...formMethods}>
            <form role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
              <Controller
                render={({ field }) => <Search label="Skriv ett eller flere søkeord" hideLabel={false} {...field} />}
                name="searchTerm"
                control={control}
                defaultValue=""
              />
            </form>
          </FormProvider>
        </div>
      </div>
      <main className="forside__content"></main>
    </>
  )
}

export default Home
