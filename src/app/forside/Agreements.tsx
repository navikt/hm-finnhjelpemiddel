'use client'
import { useMemo, useRef, useState, useEffect } from 'react'
import useSWR from 'swr'
import { AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { logUmamiFavoriteAgreementEvent } from '@/utils/umami'
import { StarFillIcon, StarIcon } from '@navikt/aksel-icons'
import { Box, Heading, HGrid, HStack, Link, VStack, Tabs, Loader } from '@navikt/ds-react'
import NextLink from 'next/link'
import styles from './Agreements.module.scss'
import { useAgreementFavorites } from '@/hooks/useAgreementFavorites'
import { useSearchParams } from 'next/navigation'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'

const Agreements = () => {
  const searchParams = useSearchParams()
  const isGridView = searchParams?.has('GRID_VIEW') ?? false

  const { message: toastMessage, icon: toastIcon, showToast } = useToast()

  const { data, error } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  const { isFavorite, toggleFavorite, isReady: isFavoritesReady } = useAgreementFavorites()

  const { favourites, all } = useMemo(() => {
    if (!data) return { favourites: [] as AgreementLabel[], all: [] as AgreementLabel[] }
    const sorted = [...data]
    sorted.sort((a, b) => sortAlphabetically(a.title, b.title, false))

    if (!isFavoritesReady) {
      return { favourites: [], all: sorted }
    }

    const favs = sorted.filter((agreement) => isFavorite(agreement.id))
    return { favourites: favs, all: sorted }
  }, [data, isFavorite, isFavoritesReady])

  type AgreementTab = 'FAVORITES' | 'OTHERS'
  const [selectedTab, setSelectedTab] = useState<AgreementTab>('OTHERS')
  const hasInitializedDefaultTabRef = useRef(false)
  useEffect(() => {
    if (!hasInitializedDefaultTabRef.current && data && isFavoritesReady) {
      setSelectedTab(favourites.length > 0 ? 'FAVORITES' : 'OTHERS')
      hasInitializedDefaultTabRef.current = true
    }
  }, [data, isFavoritesReady, favourites.length])

  const handleToggleFavorite = (label: AgreementLabel, currentlyFavorite: boolean) => {
    const nextValue = !currentlyFavorite
    // If removing and there is exactly one favourite currently, switch to others BEFORE toggling
    if (!nextValue && currentlyFavorite && favourites.length === 1) {
      setSelectedTab('OTHERS')
    }
    toggleFavorite(label.id)
    logUmamiFavoriteAgreementEvent(label.title, nextValue)

    if (nextValue) {
      showToast(
        `${label.title} er lagt til som favoritt`,
        <StarFillIcon aria-hidden height={20} width={20} color={'#ffb703'} />
      )
    } else {
      showToast(`${label.title} er fjernet som favoritt`, <StarIcon aria-hidden height={20} width={20} />)
    }
  }

  const isReadyToRenderTabs = Boolean(data) && isFavoritesReady

  return (
    <>
      <Toast message={toastMessage} icon={toastIcon} />
      <VStack gap="4" paddingInline={{ lg: '6' }}>
        <Heading level="2" size="medium">
          Hjelpemidler på avtale med Nav
        </Heading>

        {!isReadyToRenderTabs ? (
          <HStack align="center" gap="2">
            <Loader size="small" title="Laster avtaler" />
            <span>{error ? 'Kunne ikke hente avtaler' : 'Laster avtaler…'}</span>
          </HStack>
        ) : (
          <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value as AgreementTab)}>
            <Tabs.List>
              <Tabs.Tab value="OTHERS" label={`Alle avtaler${all.length ? ` (${all.length})` : ''}`} />
              <Tabs.Tab
                value="FAVORITES"
                label={`Din liste${favourites.length ? ` (${favourites.length})` : ` (0)`}`}
              />
            </Tabs.List>

            <Tabs.Panel value="FAVORITES">
              {isGridView ? (
                <HGrid
                  as="ol"
                  id="agreement-list-favourites"
                  columns={{ xs: '1fr', lg: '1fr 1fr' }}
                  gap="2"
                  className="agreement-page__list-container"
                >
                  {favourites.map((label) => (
                    <AgreementRow
                      label={label}
                      key={`fav-${label.id}`}
                      isFavorite={true}
                      onToggleFavorite={() => handleToggleFavorite(label, true)}
                    />
                  ))}
                  {favourites.length === 0 && (
                    <Box as="li" padding="4">
                      Ingen favoritter enda.
                    </Box>
                  )}
                </HGrid>
              ) : (
                <VStack as="ol" id="agreement-list-favourites" className="agreement-page__list-container">
                  {favourites.map((label) => (
                    <AgreementRow
                      label={label}
                      key={`fav-${label.id}`}
                      isFavorite={true}
                      onToggleFavorite={() => handleToggleFavorite(label, true)}
                    />
                  ))}
                  {favourites.length === 0 && (
                    <Box as="li" padding="4">
                      Ingen favoritter enda.
                    </Box>
                  )}
                </VStack>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="OTHERS">
              {isGridView ? (
                <HGrid
                  as="ol"
                  id="agreement-list-others"
                  columns={{ xs: '1fr', lg: '1fr 1fr' }}
                  gap="2"
                  className="agreement-page__list-container"
                >
                  {all.map((label) => (
                    <AgreementRow
                      label={label}
                      key={`other-${label.id}`}
                      isFavorite={isFavorite(label.id)}
                      onToggleFavorite={() => handleToggleFavorite(label, false)}
                    />
                  ))}
                  {all.length === 0 && (
                    <Box as="li" padding="4">
                      Ingen avtaler funnet
                    </Box>
                  )}
                </HGrid>
              ) : (
                <VStack as="ol" id="agreement-list-others" className="agreement-page__list-container">
                  {all.map((label) => (
                    <AgreementRow
                      label={label}
                      key={`other-${label.id}`}
                      isFavorite={isFavorite(label.id)}
                      onToggleFavorite={() => handleToggleFavorite(label, false)}
                    />
                  ))}
                  {all.length === 0 && (
                    <Box as="li" padding="4">
                      Ingen avtaler funnet
                    </Box>
                  )}
                </VStack>
              )}
            </Tabs.Panel>
          </Tabs>
        )}
      </VStack>
    </>
  )
}

const AgreementRow = ({
  label,
  isFavorite,
  onToggleFavorite,
}: {
  label: AgreementLabel
  isFavorite: boolean
  onToggleFavorite: () => void
}) => {
  const ariaLabel = isFavorite
    ? `Fjern avtale "${label.title}" fra favoritter`
    : `Legg avtale "${label.title}" til favoritter`

  return (
    <Box as="li" className="agreement-page__list-item">
      <HGrid columns={'40px auto'} gap="2" align="center" className={styles.agreementRow}>
        <button
          type="button"
          className={styles.favouriteIcon}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={ariaLabel}
        >
          {isFavorite ? (
            <StarFillIcon aria-hidden height={32} width={32} className={styles.favouriteIconMarked} />
          ) : (
            <StarFillIcon aria-hidden height={32} width={32} className={styles.favouriteIconNotMarked} />
          )}
        </button>
        <HStack align={'center'}>
          <Link as={NextLink} href={agreementProductsLink(label.id)}>
            {`${label.title} `}
          </Link>
        </HStack>
      </HGrid>
    </Box>
  )
}

export default Agreements
