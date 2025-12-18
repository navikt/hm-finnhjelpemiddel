import { useMemo } from 'react'
import useSWR from 'swr'
import { AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { logNavigationEvent } from '@/utils/amplitude'
import { StarFillIcon, StarIcon } from '@navikt/aksel-icons'
import { Box, Heading, HGrid, HStack, Link, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import styles from './Agreements.module.scss'
import { useAgreementFavorites } from '@/hooks/useAgreementFavorites'
import { useSearchParams } from 'next/navigation'

export type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const Agreements = () => {
  const searchParams = useSearchParams()
  const isGridView = searchParams?.has('GRID_VIEW') ?? false

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

  return (
    <VStack gap="4" paddingInline={{ lg: '6' }}>
      <HGrid columns={{ xs: '1', lg: '1fr' }} gap="2" align="center" className="agreement-page__list-container">
        <Heading level="2" size="medium">
          Hjelpemidler på avtale med Nav
        </Heading>
      </HGrid>

      {isGridView ? (
        <HGrid
          as="ol"
          id="agreement-list"
          columns={{ xs: '1fr', lg: '1fr 1fr' }}
          gap="2"
          className="agreement-page__list-container"
        >
          {favourites.map((label) => (
            <AgreementRow
              label={label}
              key={`fav-${label.identifier}`}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(label.id)}
            />
          ))}

          {hasFavorites && others.length > 0 && <Box as="li" style={{ gridColumn: '1 / -1', marginTop: '1.5rem' }} />}

          {others.map((label) => (
            <AgreementRow
              label={label}
              key={`other-${label.identifier}`}
              isFavorite={false}
              onToggleFavorite={() => toggleFavorite(label.id)}
            />
          ))}
        </HGrid>
      ) : (
        <VStack as="ol" id="agreement-list" className="agreement-page__list-container">
          {favourites.map((label) => (
            <AgreementRow
              label={label}
              key={`fav-${label.identifier}`}
              isFavorite={true}
              onToggleFavorite={() => toggleFavorite(label.id)}
            />
          ))}

          {hasFavorites && others.length > 0 && <Box as="li" style={{ marginTop: '1.5rem' }} />}

          {others.map((label) => (
            <AgreementRow
              label={label}
              key={`other-${label.identifier}`}
              isFavorite={false}
              onToggleFavorite={() => toggleFavorite(label.id)}
            />
          ))}
        </VStack>
      )}
    </VStack>
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
      <HGrid columns={{ xs: 'auto 40px', lg: 'auto 40px' }} gap="2" align="center" className={styles.agreementRow}>
        <HStack align={'center'}>
          <Link
            as={NextLink}
            href={agreementProductsLink(label.id)}
            onClick={() => logNavigationEvent('forside', 'hurtigoversikt', label.title)}
          >
            {`${label.title} `}
          </Link>
        </HStack>
        <button
          type="button"
          className={styles.favouriteIcon}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={ariaLabel}
        >
          {isFavorite ? (
            <StarFillIcon aria-hidden height={24} width={24} className={styles.favouriteIconMarked} />
          ) : (
            <StarIcon aria-hidden height={24} width={24} />
          )}
        </button>
      </HGrid>
    </Box>
  )
}

export default Agreements
