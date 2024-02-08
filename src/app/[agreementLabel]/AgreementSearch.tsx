'use client'

import { Agreement, mapAgreementSearchParams, toAgreementSearchQueryString } from '@/utils/agreement-util'
import { SelectedFilters } from '@/utils/api-util'
import { initialAgreementSearchDataState } from '@/utils/search-state-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'

import { FilesIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, HGrid, Hide, Popover, Show } from '@navikt/ds-react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import AgreementResults from './AgreementProducts'
import FilterForm from './FilterForm'

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

  const formMethods = useForm<AgreementSearchData>({
    defaultValues: {
      ...initialAgreementSearchDataState,
      ...searchData,
    },
  })

  const onSubmit: SubmitHandler<AgreementSearchData> = (data) => {
    router.replace(`${pathname}?${toAgreementSearchQueryString(data)}`, { scroll: false })
  }

  const onReset = () => {
    formMethods.reset()
    router.replace(pathname)
  }

  return (
    <FormProvider {...formMethods}>
      <HGrid columns={{ xs: 1, md: '390px auto' }}>
        <Show above="md" asChild>
          <div>Filter desktop</div>
        </Show>
        <Hide above="md" asChild>
          <div>Filer mobil</div>
        </Hide>
        <AgreementResults agreement={agreement}></AgreementResults>
      </HGrid>
    </FormProvider>
  )
}

const FilterDesktop = (onSubmit: SubmitHandler<AgreementSearchData>, onReset: () => void) => {
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)
  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)

  return (
    <section className="search__side-bar">
      <FilterForm onSubmit={onSubmit} ref={searchFormRef} />
      <div className="footer">
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            ref={copyButtonRef}
            variant="tertiary"
            size="small"
            icon={<FilesIcon title="Kopiér søket til utklippstavlen" />}
            onClick={() => {
              navigator.clipboard.writeText(location.href)
              setCopyPopupOpenState(true)
            }}
          >
            Kopiér søket
          </Button>
          <Popover
            open={copyPopupOpenState}
            onClose={() => setCopyPopupOpenState(false)}
            anchorEl={copyButtonRef.current}
            placement="right"
          >
            <Popover.Content>Søket er kopiert!</Popover.Content>
          </Popover>
        </div>
        <Button
          type="button"
          variant="tertiary"
          size="small"
          icon={<TrashIcon title="Nullstill søket" />}
          onClick={onReset}
        >
          Nullstill søket
        </Button>
      </div>
    </section>
  )
}

export default AgreementSearch
