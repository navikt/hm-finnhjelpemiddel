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
        <div className="home-page__container spacing-top--large">
          <div className="home-page__heading">
            <Heading level="1" size="large" spacing>
              Finn informasjon om hjelpemidler!
            </Heading>
            <Ingress>Finn informasjon om hjelpemidler i Norges største samling av hjelpemidler på nett.</Ingress>
          </div>
          <div className="home-page__input">
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
          <Panel className="home-page__border">
            <BodyLong>
              Hjelpemidlene du finner på denne siden er lagt inn av NAV og de ulike leverandørene. Det betyr at det:
            </BodyLong>
            <ul>
              <li> også er hjelpemidler i denne oversikten som NAV ikke låner ut</li>
              <li> ikke er en komplett oversikt over alle hjelpemidler som finnes</li>
            </ul>
            <BodyLong>Du kan ikke søke om hjelpemidler fra NAV på denne siden, men vi hjelper deg videre.</BodyLong>
          </Panel>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default Home
