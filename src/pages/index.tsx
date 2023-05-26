import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form'

import { BodyLong, Heading, Ingress, Panel, Search } from '@navikt/ds-react'

import { SearchData } from '@/utils/api-util'
import { mapProductSearchParams } from '@/utils/product-util'
import { initialSearchDataState } from '@/utils/search-state-util'

import AnimateLayout from '@/components/layout/AnimateLayout'

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
    <div className="home-page">
      <AnimateLayout>
        <div className="home-page__container spacing-top--large">
          <div className="home-page__heading max-width">
            <Heading level="1" size="large" spacing>
              Finn informasjon om hjelpemidler!
            </Heading>
            <Ingress spacing>
              {' '}
              Finn informasjon om hjelpemidler i Norges største samling av hjelpemidler på nett.
            </Ingress>
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
            <BodyLong spacing className="home-page__content">
              Hjelpemidlene du finner på denne siden er lagt inn av NAV og de ulike leverandørene. Det betyr at det:
              <div className="list-style-type:disc">
                <li> også er hjelpemidler i denne oversikten som NAV ikke låner ut</li>
                <li> ikke er en komplett oversikt over alle hjelpemidler som finnes</li>
              </div>
              Du kan ikke søke om hjelpemidler fra NAV på denne siden, men vi hjelper deg videre.
            </BodyLong>
          </Panel>
        </div>
      </AnimateLayout>
    </div>
  )
}

export default Home
