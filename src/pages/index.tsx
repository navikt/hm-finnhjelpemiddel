import React, {useState} from 'react';
import {Button, Search, Switch} from "@navikt/ds-react";
import {initialSearchDataState, useHydratedSearchStore} from "@/utils/search-state-util";
import {Controller, FormProvider, SubmitHandler, useForm} from "react-hook-form";
import {SearchData} from "@/utils/api-util";
import {mapProductSearchParams} from "@/utils/product-util";
import SelectIsoCategory from "@/components/sidebar/SelectIsoCategory";
import FilterView from "@/components/sidebar/FilterView";
import {Delete} from "@navikt/ds-icons";
import {useRouter} from "next/router";

function Home(props: any) {
  const router = useRouter()
  const FocusOnResultsButton = ({ setFocus }: { setFocus: () => void }) => {
    return (
      <div className="search__focus-on-results">
        <Button variant="secondary" size="small" type="button" onClick={setFocus}>
          Gå til resultat
        </Button>
      </div>
    )
  }
  const onSubmit: SubmitHandler<SearchData> = (data) => {
    router.push('/sok?term='+ data.searchTerm)
  }
  const [productSearchParams] = useState(mapProductSearchParams(router.query))
  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialSearchDataState,
      ...productSearchParams,
    },
  })
  const { control, handleSubmit, reset: resetForm, setValue } = formMethods
  const { searchData, setSearchData } = useHydratedSearchStore()

  return (
    <div>
    <div className="searchbar">
      <div className="searchbar__heading">
            {/*Alt* av hjelpemidler samlet på en plass*/}
        Lett å finne frem til informasjon om hjelpemidler!
      </div>
      <div className="searchbar__input">
        <FormProvider {...formMethods}>
          <form role="search" onSubmit={handleSubmit(onSubmit)} aria-controls="searchResults">
            <Controller
              render={({ field }) => (
                <Search
                  className="search__input"
                  label="Skriv ett eller flere søkeord"
                  hideLabel={false}
                  {...field}
                />
              )}
              name="searchTerm"
              control={control}
              defaultValue=""
            />
          </form>
        </FormProvider>
      </div>
    </div>
  <main className="forside__content">
  </main>
    </div>
  );
}

export default Home;
