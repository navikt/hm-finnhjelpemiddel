'use client'

import { Agreement, mapAgreementProducts, mapPostTitle } from '@/utils/agreement-util'
import {
  Filter,
  FilterData,
  SearchData,
  SelectedFilters,
  getFiltersAgreement,
  getProductsOnAgreement,
} from '@/utils/api-util'
import { initialAgreementSearchDataState } from '@/utils/search-state-util'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'

import MobileOverlay from '@/components/MobileOverlay'
import CompareMenu from '@/components/layout/CompareMenu'
import { mapSearchParams, toSearchQueryString } from '@/utils/product-util'
import { PostBucketResponse } from '@/utils/response-types'
import { FilesIcon, FilterIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HGrid, HStack, Heading, Hide, Link, Loader, Popover, Show, VStack } from '@navikt/ds-react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'
import AgreementResults from './AgreementResults'
import FilterForm from './FilterForm'

export type AgreementSearchData = {
  searchTerm: string
  hidePictures: boolean
  filters: SelectedFilters
}

const AgreementPage = ({ agreement }: { agreement: Agreement }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const copyButtonMobileRef = useRef<HTMLButtonElement>(null)
  const copyButtonDesktopRef = useRef<HTMLButtonElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)

  const [copyPopupOpenState, setCopyPopupOpenState] = useState(false)
  const [mobileOverlayOpen, setMobileOverlayOpen] = useState(false)

  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const formMethods = useForm<SearchData>({
    defaultValues: {
      ...initialAgreementSearchDataState,
      ...searchData,
    },
  })

  const onSubmit: SubmitHandler<SearchData> = (data) => {
    router.replace(`${pathname}?${toSearchQueryString(data)}`, { scroll: false })
  }

  const { data: postBucktes, isLoading: postsIsLoading } = useSWR<PostBucketResponse[]>(
    { agreementId: agreement.id, searchData: searchData },
    getProductsOnAgreement,
    { keepPreviousData: true }
  )

  const { data: filtersFromData, isLoading: filtersIsLoading } = useSWR<FilterData>(
    { agreementId: agreement.id },
    getFiltersAgreement,
    {
      keepPreviousData: true,
    }
  )

  const postFilters: Filter = {
    values: agreement.posts
      .sort((a, b) => a.nr - b.nr)
      .map((post) => ({ key: post.title, doc_count: 1, label: `${post.nr}: ${mapPostTitle(post.title)}` })),
  }

  // if (postsIsLoading || filtersIsLoading) {
  //   return <Loader size="3xlarge" title="Laster produkter" style={{ margin: '0 auto' }} />
  // }

  if (!postBucktes || !filtersFromData) {
    return <Loader size="3xlarge" title="Laster produkter" style={{ margin: '0 auto' }} />
  }

  const filters: FilterData = {
    ...filtersFromData,
    delkontrakt: postFilters,
  }

  const posts = mapAgreementProducts(postBucktes, agreement)

  const onReset = () => {
    formMethods.reset()
    router.replace(pathname)
  }

  return (
    <VStack className="main-wrapper--large spacing-bottom--large">
      <VStack gap="5" className="spacing-top--large spacing-bottom--xlarge">
        <HStack gap="3">
          <Link as={NextLink} href="/" variant="subtle">
            Alle hjelpemiddel
          </Link>
          <BodyShort textColor="subtle">/</BodyShort>
        </HStack>
        <Heading level="1" size="large">
          {agreement.title}
        </Heading>
      </VStack>

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
                  variant="tertiary-neutral"
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
                  variant="tertiary-neutral"
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
                    <HGrid columns={{ xs: 2 }} className="agreement-filter__footer" gap="2">
                      <Button
                        ref={copyButtonMobileRef}
                        variant="tertiary-neutral"
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
                        variant="tertiary-neutral"
                        size="small"
                        icon={<TrashIcon title="Nullstill søket" />}
                        onClick={onReset}
                      >
                        Nullstill søket
                      </Button>
                    </HGrid>
                    <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
                  </VStack>
                </MobileOverlay.Footer>
              </MobileOverlay>
            </div>
          </Hide>
          <AgreementResults posts={posts} formRef={searchFormRef}></AgreementResults>
        </HGrid>
      </FormProvider>
    </VStack>
  )
}

export default AgreementPage
