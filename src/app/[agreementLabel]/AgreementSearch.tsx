'use client'

import {
  Agreement,
  mapAgreementProducts,
  mapAgreementSearchParams,
  toAgreementSearchQueryString,
} from '@/utils/agreement-util'
import { FetchPostBucketsWithFilters, SelectedFilters, getProductsOnAgreement } from '@/utils/api-util'
import { initialAgreementSearchDataState } from '@/utils/search-state-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useRef } from 'react'

import { BodyShort, HGrid, Hide, Show } from '@navikt/ds-react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import AgreementResults from './AgreementProducts'
import FilterDesktop from './FilterDesktop'
import FilterMobile from './FilterMobile'

export type AgreementSearchData = {
  searchTerm: string
  hidePictures: boolean
  filters: SelectedFilters
}

const AgreementSearch = ({ agreement }: { agreement: Agreement }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchData = useMemo(() => mapAgreementSearchParams(searchParams), [searchParams])

  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const formMethods = useForm<AgreementSearchData>({
    defaultValues: {
      ...initialAgreementSearchDataState,
      ...searchData,
    },
  })
  const onSubmit: SubmitHandler<AgreementSearchData> = (data) => {
    router.replace(`${pathname}?${toAgreementSearchQueryString(data)}`, { scroll: false })
  }

  const { data, error, isLoading } = useSWR<FetchPostBucketsWithFilters>(agreement.id, getProductsOnAgreement)

  if (!data) {
    return <BodyShort>Finner ikke data</BodyShort>
  }

  const posts = mapAgreementProducts(data.postBuckets, agreement)

  const onReset = () => {
    formMethods.reset()
    router.replace(pathname)
  }

  return (
    <FormProvider {...formMethods}>
      <HGrid columns={{ xs: 1, md: '390px auto' }} gap="18">
        <Show above="md">
          <FilterDesktop
            filters={data.filters}
            onSubmit={onSubmit}
            onReset={onReset}
            searchFormRef={searchFormRef}
            copyButtonRef={copyButtonRef}
          ></FilterDesktop>
        </Show>
        <Hide above="md">
          <FilterMobile
            filters={data.filters}
            onSubmit={onSubmit}
            onReset={onReset}
            searchFormRef={searchFormRef}
            copyButtonRef={copyButtonRef}
          ></FilterMobile>
        </Hide>
        <AgreementResults posts={posts}></AgreementResults>
      </HGrid>
    </FormProvider>
  )
}

export default AgreementSearch
