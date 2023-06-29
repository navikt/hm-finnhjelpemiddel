'use client'

import React, { useState } from 'react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import { useRouter, useSearchParams } from 'next/navigation'

import { BodyLong, Heading, Ingress, Panel, Search } from '@navikt/ds-react'

import { SearchData } from '@/utils/api-util'
import { mapProductSearchParams } from '@/utils/product-util'
import { initialSearchDataState } from '@/utils/search-state-util'

import AnimateLayout from '@/components/layout/AnimateLayout'

function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [productSearchParams] = useState(mapProductSearchParams(searchParams))

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })
  const { control, handleSubmit } = formMethods

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    router.push('/sok?term=' + data.searchTerm)
  }

  return (
    <div className="home-page">
      <AnimateLayout>
        <div className="home-page__background-container blue">
          <div className="home-page__search-container">
            <div className="home-page__heading">
              <Heading level="1" size="xlarge" spacing>
                Finn informasjon om hjelpemidler
              </Heading>
              <Ingress>Finn informasjon om hjelpemidler i Norges største samling av hjelpemidler på nett.</Ingress>
            </div>
            <div className="home-page__input">
              <FormProvider {...formMethods}>
                <form role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
                  <Controller
                    render={({ field }) => (
                      <Search label="Skriv ett eller flere søkeord" hideLabel={false} {...field} />
                    )}
                    name="searchTerm"
                    control={control}
                    defaultValue=""
                  />
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
        <div className="home-page__background-container red">
          <div className="polygon-shape"></div>
          <div className="home-page__agreement-container">
            <div className="home-page__heading">
              <Heading level="2" size="large" spacing>
                Produkter på avtale med NAV
              </Heading>
              <Ingress>
                NAV kjøper og eier hjelpemidlene som formidles gjennom hjelpemiddelsentralene. På noen produktområder
                inngår NAV rammeavtaler med leverandørene. Produktene i rammeavtalene er det nasjonale sortimentet av
                hjelpemidler.
              </Ingress>
            </div>
            <div className="home-page__agreement-links"></div>
          </div>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default Home
