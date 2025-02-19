'use client'

import { Filter, FilterData, getFiltersAgreement, getProductsOnAgreement } from '@/utils/api-util'
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import useSWR from 'swr'

import MobileOverlay from '@/components/MobileOverlay'
import CompareMenu from '@/components/layout/CompareMenu'
import LinkPanelLocal from '@/components/link-panel/LinkPanelLocal'
import { useFeatureFlags } from '@/hooks/useFeatureFlag'
import { Agreement, mapAgreementProducts } from '@/utils/agreement-util'
import { mapSearchParams, toSearchQueryString } from '@/utils/mapSearchParams'
import { PostBucketResponse } from '@/utils/response-types'
import { FormSearchData, initialAgreementSearchDataState } from '@/utils/search-state-util'
import { dateToString } from '@/utils/string-util'
import {
  FilesIcon,
  FilterIcon,
  ImageIcon,
  PackageIcon,
  PrinterSmallIcon,
  TrashIcon,
  WrenchIcon,
} from '@navikt/aksel-icons'
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Heading,
  HGrid,
  HStack,
  Link,
  Loader,
  Popover,
  Show,
  ToggleGroup,
  VStack,
} from '@navikt/ds-react'
import AgreementPrintableVersion from './AgreementPrintableVersion'
import FilterForm from './FilterForm'
import PostsList from './PostsList'
import PostsListIsoGroups from "@/app/rammeavtale/hjelpemidler/[agreementId]/PostsListIsoGroups";

export type AgreementSearchData = {
  searchTerm: string
  hidePictures: boolean
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

  const pictureToggleValue = searchParams.get('hidePictures') ?? 'show-pictures'
  const searchData = mapSearchParams(searchParams)

  const avtalerMedIsoGruppering = ['9d8ff31e-c536-4f4d-9b2f-75cc527c727f', 'b9a48c54-3004-4f94-ab65-b38deec78ed3']

  const formMethods = useForm<FormSearchData>({
    defaultValues: {
      hidePictures: 'show-pictures',
      ...searchData,
      filters: { ...initialAgreementSearchDataState.filters, ...searchData.filters, status: ['På avtale'] },
    },
  })

  useEffect(() => {
    setShowSidebar(window.innerWidth >= 1024)
    window.addEventListener('resize', () => setShowSidebar(window.innerWidth >= 1024))
  }, [])

  const handleSetToggle = (value: string) => {
    formMethods.setValue('hidePictures', value)
    searchFormRef.current?.requestSubmit()
  }

  const onSubmit: SubmitHandler<FormSearchData> = () => {
    router.replace(`${pathname}?${toSearchQueryString(formMethods.getValues(), searchData.searchTerm)}`, {
      scroll: false,
    })
  }

  const {
    data: postBuckets,
    isLoading: postsIsLoading,
    error: postError,
  } = useSWR<PostBucketResponse[]>({ agreementId: agreement.id, searchData: searchData }, getProductsOnAgreement, {
    keepPreviousData: true,
  })

  const { data: filtersFromData, isLoading: filtersIsLoading } = useSWR<FilterData>(
    { agreementId: agreement.id, type: 'filterdata' },
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
        label: post.title,
      })),
  }

  if (!postBuckets || !filtersFromData) {
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

  //NB! Vi har brukt top_hits i open search til å hente produkter på delkontrakt og mapper over til serier her.
  //Dersom det finnes en delkontrakt med over 500 varianter vil ikke alle seriene vises. Da må vi vurdere å ha et kall per delkontrakt.
  const posts = mapAgreementProducts(postBuckets, agreement, searchData.filters)

  const onReset = () => {
    formMethods.reset()
    router.replace(pathname)
  }

  return (
    <>
      <AgreementPrintableVersion postWithProducts={posts} />
      <VStack className="main-wrapper--large spacing-bottom--xlarge hide-print">
        <VStack gap="5" className="spacing-vertical--xlarge">
          <HStack gap="3">
            <Link as={NextLink} href="/" variant="subtle">
              Hjelpemidler på avtale med Nav
            </Link>
            <BodyShort textColor="subtle">/</BodyShort>
          </HStack>
          <Heading level="1" size="xlarge" className="agreement-page__heading">
            {`${agreement.title}`}
          </Heading>
          <div>
            <BodyLong size="small">
              {`Avtaleperiode: ${dateToString(agreement.published)} - ${dateToString(agreement.expired)}`}
            </BodyLong>
            <BodyLong
              size="small">{`Avtalenummer:  ${agreement.reference.includes('og') ? agreement.reference : agreement.reference.replace(' ', ' og ')}`}</BodyLong>
          </div>

          <TopLinks agreementId={agreement.id} />
        </VStack>

        <FormProvider {...formMethods}>
          <CompareMenu />

          <VStack gap={{ xs: '4', md: '8' }}>
            <Heading level="2" size="large">
              Delkontrakter
            </Heading>
            <span style={{ width: '100%', borderTop: '1px solid #838C9A' }} />
            <HStack justify="space-between" align="center" gap="2" className="spacing-bottom--medium">
              {showSidebar && <FilterForm onSubmit={onSubmit} ref={searchFormRef} filters={filters} />}
              {!showSidebar && (
                <HStack gap="2">
                  <Button
                    variant="secondary-neutral"
                    className="button-with-thin-border"
                    onClick={() => setMobileOverlayOpen(true)}
                    icon={<FilterIcon aria-hidden />}
                  >
                    Filter
                  </Button>
                  <Show below="sm">
                    <Button
                      variant="secondary-neutral"
                      className="button-with-thin-border"
                      onClick={() => {
                        window.print()
                      }}
                      icon={<PrinterSmallIcon aria-hidden fontSize="1.5rem" />}
                    >
                      {`Hurtigoversikt (PDF)`}
                    </Button>
                  </Show>
                </HStack>
              )}

              <MobileOverlay open={mobileOverlayOpen}>
                <MobileOverlay.Header onClose={() => setMobileOverlayOpen(false)}>
                  <Heading level="1" size="medium">
                    Filtrer søket
                  </Heading>
                </MobileOverlay.Header>
                <MobileOverlay.Content>
                  <FilterForm onSubmit={onSubmit} ref={searchFormRef} filters={filters} />
                </MobileOverlay.Content>
                <MobileOverlay.Footer>
                  <VStack gap="2">
                    <HGrid columns={{ xs: 2 }} className="filter-container__footer" gap="2">
                      <Button
                        ref={copyButtonMobileRef}
                        variant="secondary"
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
                        variant="secondary"
                        size="small"
                        icon={<TrashIcon title="Nullstill søket" />}
                        onClick={onReset}
                      >
                        Tøm filtre
                      </Button>
                    </HGrid>
                    <Button onClick={() => setMobileOverlayOpen(false)}>Vis søkeresultater</Button>
                  </VStack>
                </MobileOverlay.Footer>
              </MobileOverlay>

              <HStack gap="4" className="hurtigoversikt-toggle__container">
                <ToggleGroup
                  className="hurtigoversikt-toggle"
                  defaultValue="show-pictures"
                  onChange={handleSetToggle}
                  value={pictureToggleValue}
                  variant="neutral"
                  style={{ minWidth: '222px' }}
                >
                  <ToggleGroup.Item value="show-pictures">
                    <ImageIcon aria-hidden />
                    Vis bilde
                  </ToggleGroup.Item>
                  <ToggleGroup.Item value="hide-pictures">Uten bilde</ToggleGroup.Item>
                </ToggleGroup>
                <Show above="sm">
                  <Button
                    variant="secondary-neutral"
                    className="button-with-thin-border"
                    onClick={() => {
                      window.print()
                    }}
                    icon={<PrinterSmallIcon aria-hidden fontSize="1.5rem" />}
                  >
                    {`Hurtigoversikt (PDF)`}
                  </Button>
                </Show>
              </HStack>
            </HStack>

            {avtalerMedIsoGruppering.includes(agreement.id) ? (
              <PostsListIsoGroups posts={posts} postLoading={postsIsLoading} postError={postError} />
            ) : (
              <PostsList posts={posts} postLoading={postsIsLoading} postError={postError} />
            )}

            {postError && (
              <Alert variant="error" title="Error med lasting av produkter">
                Det har skjedd en feil ved innhenting av produkter. Vennligst prøv igjen senere.
              </Alert>
            )}

            {!postError && posts.length === 0 && (
              <Alert variant="info">Obs! Fant ingen hjelpemiddel. Har du sjekket filtrene dine?</Alert>
            )}
          </VStack>
        </FormProvider>
      </VStack>
    </>
  )
}

const TopLinks = ({ agreementId }: { agreementId: string }) => {
  const { toggles, isEnabled, isLoading } = useFeatureFlags()

  if (isLoading) {
    return (
      <HStack justify="center" style={{ marginTop: '28px' }}>
        <Loader size="xlarge" title="Laster..." />
      </HStack>
    )
  }

  const isHygieneAvtale =
    agreementId === '034fccf7-c481-4c2b-9867-4d092f89c0fe' || agreementId === '22469a9d-0cc2-41c4-8564-085b0d836144'

  const isLofteplattformAvtale = agreementId === '4432dc25-88c1-429e-95f3-0ed55836335e' || agreementId === '039c71d2-d325-47c0-99ec-8ac85748d40d'
  const isStaastativAvtale = agreementId === 'deec7554-2d7e-442f-a63f-1fda49ef77c7' || agreementId === '216b3d7b-ce74-4bf4-aeca-f06888f5c072'
  const isGanghjelpemidlerAvtale = agreementId === '35a25ae9-d307-42a6-8893-732de01e02ce' || agreementId === 'f1ddd971-17f1-4241-8593-edaf377f66f0'
  const isArbeidsstolAvtale = agreementId === 'b062ea46-9cec-4503-982c-943c1734120d' || agreementId === '26e60523-b4d8-4f82-a59e-2eadcc3829e3'
  const isOverflyttingAvtale = agreementId === 'a9f619de-1223-422f-828f-c6f380622a55' || agreementId === '02e30ace-82bc-426c-b2fc-5cc6b2c48a81'
  const isKalendereAvtale = agreementId === 'de45889f-e4cd-45a2-9b36-5652594e1fba' || agreementId === 'f1596dac-3898-434f-8a39-902f5fb307ac'
  const isKjoreramper = agreementId === '3ea91ddf-f8e1-4d2b-a4a7-e81fca132733' || agreementId === 'e86fd988-0381-4d0a-a027-7654e2d8dbab'
  const isMadrasserTrykkforebyggendeAvtale = agreementId === 'ff48ef4c-d450-4c0e-b99e-244ddecbfc59' || agreementId === '5b3b139e-4eec-4461-bade-18e41115b56d'
  const isSengerAvtale = agreementId === 'f38e94b6-ad85-4cf6-bc26-f14dff0f3e20' || agreementId === '61135e09-f6ba-44ba-8e0d-3994c2883f4c'
  const isOppreisingsstolerAvtale = agreementId === '44e87ba7-6f1a-4d70-b5ff-28d6e8c54bd6' || agreementId === '547883d7-6459-44b9-9684-22192839336d'
  const isVarmehjelpemidlerAvtale = agreementId === '38a0c948-fb9f-4cbb-a8d1-de22ac158ea2' || agreementId === 'fa455679-8674-4083-8c1a-5284847b8d41'
  const isSitteputerAvtale = agreementId === '26542d09-61c1-49e6-80e8-eef6a9ea7faf'
  const isKommunikasjonsHjelpemidlerAvtale = agreementId === '1f74afc7-9740-41cc-8648-cd942c392d42'
  const isMRSAvtale = agreementId === '3a020eea-eec5-4ef4-80cc-66268a7a62a7' || agreementId === '3a020eea-eec5-4ef4-80cc-66268a7a62a7'

  const showAccessoriesAndSparePartsList =
    isEnabled('finnhjelpemiddel.vis-tilbehor-og-reservedel-lister')
    && (isLofteplattformAvtale
      || isStaastativAvtale || isGanghjelpemidlerAvtale || isArbeidsstolAvtale || isOverflyttingAvtale
      || isKalendereAvtale || isKjoreramper || isMadrasserTrykkforebyggendeAvtale || isSengerAvtale
      || isOppreisingsstolerAvtale || isVarmehjelpemidlerAvtale || isSitteputerAvtale || isKommunikasjonsHjelpemidlerAvtale || isMRSAvtale)

  return (
    <HGrid gap={{ xs: '3', md: '7' }} columns={{ xs: 1, sm: 3 }} className="spacing-top--small">
      <LinkPanelLocal
        href={
          showAccessoriesAndSparePartsList
            ? `/rammeavtale/${agreementId}/tilbehor`
            : `/rammeavtale/${agreementId}#Tilbehor`
        }
        icon={<PackageIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}
        title="Tilbehør"
        description={
          showAccessoriesAndSparePartsList
            ? 'Gå til avtalens tilbehørslister'
            : 'Gå til avtalens tilbehørslister i PDF-format'
        }
      />

      <LinkPanelLocal
        href={
          showAccessoriesAndSparePartsList
            ? `/rammeavtale/${agreementId}/reservedeler`
            : `/rammeavtale/${agreementId}#Reservedeler`
        }
        icon={<WrenchIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}
        title="Reservedeler"
        description={
          showAccessoriesAndSparePartsList
            ? 'Gå til avtalens reservedellister'
            : 'Gå til avtalens reservedellister i PDF-format'
        }
      />
      <LinkPanelLocal
        href={`/rammeavtale/${agreementId}`}
        icon={<FilesIcon color="#005b82" fontSize={'1.5rem'} aria-hidden={true} />}
        title="Om avtalen"
        description="Les om avtalen og se tilhørende dokumenter"
      />
    </HGrid>
  )
}

export default AgreementPage
