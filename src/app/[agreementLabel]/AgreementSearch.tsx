'use client'

import {
  Agreement,
  mapAgreementProducts,
  mapAgreementSearchParams,
  toAgreementSearchQueryString,
} from '@/utils/agreement-util'
import { FilterData, SelectedFilters, getFiltersAgreement, getProductsOnAgreement } from '@/utils/api-util'
import { initialAgreementSearchDataState } from '@/utils/search-state-util'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'

import MobileOverlay from '@/components/MobileOverlay'
import CompareMenu from '@/components/layout/CompareMenu'
import { PostBucketResponse } from '@/utils/response-types'
import { FilesIcon, FilterIcon, TrashIcon } from '@navikt/aksel-icons'
import { Button, HGrid, HStack, Heading, Hide, Loader, Popover, Show, VStack } from '@navikt/ds-react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import AgreementResults from './AgreementResults'
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

  const copyButtonMobileRef = useRef<HTMLButtonElement>(null)
  const copyButtonDesktopRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)

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

  const { data: postBucktes, isLoading: postsIsLoading } = useSWR<PostBucketResponse[]>(
    { agreementId: agreement.id, searchData: searchData },
    getProductsOnAgreement,
    { keepPreviousData: true }
  )

  const { data: filters, isLoading: filtersIsLoading } = useSWR<FilterData>(
    { agreementId: agreement.id },
    getFiltersAgreement,
    {
      keepPreviousData: true,
    }
  )

  // if (postsIsLoading || filtersIsLoading) {
  //   return <Loader size="3xlarge" title="Laster produkter" style={{ margin: '0 auto' }} />
  // }

  if (!postBucktes || !filters) {
    return <Loader size="3xlarge" title="Laster produkter" style={{ margin: '0 auto' }} />
  }

  const posts = mapAgreementProducts(postBucktes, agreement)

  const onReset = () => {
    formMethods.reset()
    router.replace(pathname)
  }

  return (
    <FormProvider {...formMethods}>
      <CompareMenu />
      <HGrid columns={{ xs: 1, md: '390px auto' }} gap={{ xs: '4', md: '18' }}>
        <Show above="md">
          <section className="agreement-filter">
            <FilterForm
              onSubmit={onSubmit}
              ref={searchFormRef}
              filters={filters}
              selectedFilters={searchData.filters}
            />
            <HGrid columns={{ xs: 2 }} className="agreement-filter__footer" gap="2">
              <Button
                ref={copyButtonDesktopRef}
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
                anchorEl={copyButtonDesktopRef.current}
                placement="right"
              >
                <Popover.Content>Søket er kopiert!</Popover.Content>
              </Popover>

              <Button
                type="button"
                variant="tertiary"
                size="small"
                icon={<TrashIcon title="Nullstill søket" />}
                onClick={onReset}
              >
                Nullstill søket
              </Button>
            </HGrid>
          </section>
        </Show>
        <Hide above="md">
          <div>
            <Button
              variant="secondary"
              size="small"
              onClick={() => setMobileOverlayOpen(true)}
              icon={<FilterIcon aria-hidden />}
            >
              Filter
            </Button>

            <MobileOverlay open={mobileOverlayOpen}>
              <MobileOverlay.Header onClose={() => setMobileOverlayOpen(false)}>
                <Heading level="1" size="medium">
                  Filtrer søket
                </Heading>
              </MobileOverlay.Header>
              <MobileOverlay.Content>
                <FilterForm
                  onSubmit={onSubmit}
                  ref={searchFormRef}
                  filters={filters}
                  selectedFilters={searchData.filters}
                />
              </MobileOverlay.Content>
              <MobileOverlay.Footer>
                <VStack gap="2">
                  <HStack className="agreement-filter__footer" gap="2">
                    <Button
                      ref={copyButtonMobileRef}
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
                      anchorEl={copyButtonMobileRef.current}
                      placement="right"
                    >
                      <Popover.Content>Søket er kopiert!</Popover.Content>
                    </Popover>

                    <Button
                      type="button"
                      variant="tertiary"
                      size="small"
                      icon={<TrashIcon title="Nullstill søket" />}
                      onClick={onReset}
                    >
                      Nullstill søket
                    </Button>
                  </HStack>
                  <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
                </VStack>
              </MobileOverlay.Footer>
            </MobileOverlay>
          </div>
        </Hide>
        <AgreementResults posts={posts}></AgreementResults>
      </HGrid>
    </FormProvider>
  )
}

export default AgreementSearch
