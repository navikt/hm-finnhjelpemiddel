'use client'

import { Agreement, makePostTitleBasedOnAgreementId, mapAgreementProducts } from '@/utils/agreement-util'
import {
  Filter,
  FilterData,
  FormSearchData,
  SelectedFilters,
  getFiltersAgreement,
  getProductsOnAgreement,
} from '@/utils/api-util'
import { initialAgreementSearchDataState } from '@/utils/search-state-util'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import MobileOverlay from '@/components/MobileOverlay'
import CompareMenu from '@/components/layout/CompareMenu'
import { mapSearchParams, toSearchQueryString } from '@/utils/product-util'
import { PostBucketResponse } from '@/utils/response-types'
import { FilesIcon, FilterIcon, TrashIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Button, HGrid, HStack, Heading, Link, Loader, Popover, VStack } from '@navikt/ds-react'
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
  const [showSidebar, setShowSidebar] = useState(false)

  const searchData = useMemo(() => mapSearchParams(searchParams), [searchParams])

  const formMethods = useForm<FormSearchData>({
    defaultValues: {
      ...initialAgreementSearchDataState,
      ...searchData,
    },
  })

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1024)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1024))
  }, [])

  const onSubmit: SubmitHandler<FormSearchData> = (data) => {
    router.replace(`${pathname}?${toSearchQueryString(data, searchData.searchTerm)}`, { scroll: false })
  }

  const {
    data: postBucktes,
    isLoading: postsIsLoading,
    error: postError,
  } = useSWR<PostBucketResponse[]>({ agreementId: agreement.id, searchData: searchData }, getProductsOnAgreement, {
    keepPreviousData: true,
  })

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
      .map((post) => ({
        key: post.title,
        doc_count: 1,
        label: makePostTitleBasedOnAgreementId(post.title, post.nr, agreement.id),
      })),
  }

  // if (postsIsLoading || filtersIsLoading) {
  //   return <Loader size="3xlarge" title="Laster produkter" style={{ margin: '0 auto' }} />
  // }

  if (postError) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Alert variant="error" title="Error med lasting av produkter">
          Obs, her skjedde det noe feil :o
        </Alert>
      </HStack>
    )
  }

  if (!postBucktes || !filtersFromData) {
    return (
      <HStack justify="center" style={{ marginTop: '48px' }}>
        <Loader size="3xlarge" title="Laster produkter" />
      </HStack>
    )
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
        <HGrid columns={{ xs: 1, lg: '390px auto' }} gap={{ xs: '4', lg: '18' }}>
          {showSidebar && (
            <section className="filter-container">
              <FilterForm
                onSubmit={onSubmit}
                ref={searchFormRef}
                filters={filters}
                selectedFilters={searchData.filters}
              />
              <HGrid columns={{ xs: 2 }} className="filter-container__footer" gap="2">
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
          )}
          {!showSidebar && (
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
                    <HGrid columns={{ xs: 2 }} className="filter-container__footer" gap="2">
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
          )}
          <AgreementResults posts={posts} formRef={searchFormRef}></AgreementResults>
        </HGrid>
      </FormProvider>
    </VStack>
  )
}

export default AgreementPage