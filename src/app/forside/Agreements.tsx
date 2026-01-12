import { useMemo, useRef } from 'react'
import useSWR from 'swr'
import { AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { logUmamiFavoriteAgreementEvent } from '@/utils/umami'
import { StarFillIcon, StarIcon } from '@navikt/aksel-icons'
import { Box, Heading, HGrid, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import styles from './Agreements.module.scss'
import { useAgreementFavorites } from '@/hooks/useAgreementFavorites'
import { useSearchParams } from 'next/navigation'
import { Toast } from '@/components/Toast'
import { useToast } from '@/hooks/useToast'

const Agreements = () => {
  const searchParams = useSearchParams()
  const isGridView = searchParams?.has('GRID_VIEW') ?? false

  const favouritesRef = useRef<HTMLOListElement | null>(null)
  const { message: toastMessage, icon: toastIcon, showToast } = useToast()

  const { data } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  const { isFavorite, toggleFavorite, isReady: isFavoritesReady } = useAgreementFavorites()

  const { favourites, others } = useMemo(() => {
    if (!data) return { favourites: [] as AgreementLabel[], others: [] as AgreementLabel[] }
    const sorted = [...data]

    sorted.sort((a, b) => sortAlphabetically(a.title, b.title, false))

    if (!isFavoritesReady) {
      return { favourites: [], others: sorted }
    }

    const favs = sorted.filter((agreement) => isFavorite(agreement.id))
    const rest = sorted.filter((agreement) => !isFavorite(agreement.id))

    return { favourites: favs, others: rest }
  }, [data, isFavorite, isFavoritesReady])

  const hasFavorites = favourites.length > 0

  const handleToggleFavorite = (label: AgreementLabel, currentlyFavorite: boolean) => {
    const nextValue = !currentlyFavorite
    toggleFavorite(label.id)
    logUmamiFavoriteAgreementEvent(label.title, nextValue)

    if (nextValue) {
      showToast(
        `${label.title} er lagt til som favoritt`,
        <StarFillIcon aria-hidden height={20} width={20} color={'#ffb703'} />
      )

      if (favouritesRef.current) {
        const rect = favouritesRef.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        
        if (!isVisible) {
          favouritesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    } else {
      showToast(`${label.title} er fjernet som favoritt`, <StarIcon aria-hidden height={20} width={20} />)
    }
  }

  return (
    <>
      <Toast message={toastMessage} icon={toastIcon} />
      <VStack gap="4" paddingInline={{ lg: '6' }}>
        <Heading level="2" size="medium">
          Hjelpemidler på avtale med Nav
        </Heading>

        {isGridView ? (
          <HGrid
            as="ol"
            id="agreement-list"
            columns={{ xs: '1fr', lg: '1fr 1fr' }}
            gap="2"
            className="agreement-page__list-container"
            ref={favouritesRef}
          >
            {favourites.map((label) => (
              <AgreementRow
                label={label}
                key={`fav-${label.identifier}`}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFavorite(label, true)}
              />
            ))}

            {hasFavorites && others.length > 0 && <Box as="li" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }} />}

            {others.map((label) => (
              <AgreementRow
                label={label}
                key={`other-${label.identifier}`}
                isFavorite={false}
                onToggleFavorite={() => handleToggleFavorite(label, false)}
              />
            ))}
          </HGrid>
        ) : (
          <VStack as="ol" id="agreement-list" className="agreement-page__list-container" ref={favouritesRef}>
            {favourites.map((label) => (
              <AgreementRow
                label={label}
                key={`fav-${label.identifier}`}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFavorite(label, true)}
              />
            ))}

            {hasFavorites && others.length > 0 && <Box as="li" style={{ marginTop: '1.5rem' }} />}

            {others.map((label) => (
              <AgreementRow
                label={label}
                key={`other-${label.identifier}`}
                isFavorite={false}
                onToggleFavorite={() => handleToggleFavorite(label, false)}
              />
            ))}
          </VStack>
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
            <StarIcon aria-hidden height={32} width={32} />
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
