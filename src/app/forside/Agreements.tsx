import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { logKlikk, logNavigationEvent } from '@/utils/amplitude'
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Heading, HGrid, Hide, HStack, Link, Show, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import { defaultAriaLabel, getAriaLabel } from '@/utils/ariaLabel-util'
import NextLink from 'next/link'
import { dateToString } from '@/utils/string-util'
import styles from './Agreements.module.scss'

type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const Agreements = () => {
  const [sortColumn, setSortColumn] = useState<SortColumns>({ orderBy: 'title', direction: 'ascending' })
  const { data } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place

    if (sortColumn.orderBy === 'published') {
      if (sortColumn.direction === 'ascending') {
        sorted.sort((a, b) => a.published.getTime() - b.published.getTime())
      } else {
        sorted.sort((a, b) => b.published.getTime() - a.published.getTime())
      }
    } else if (sortColumn.orderBy === 'expires') {
      if (sortColumn.direction === 'ascending') {
        sorted.sort((a, b) => a.expires.getTime() - b.expires.getTime())
      } else {
        sorted.sort((a, b) => b.expires.getTime() - a.expires.getTime())
      }
    } else {
      sorted.sort((a, b) => sortAlphabetically(a.title, b.title, sortColumn.direction === 'descending'))
    }

    return sorted
  }, [data, sortColumn])

  const handleSortColumn = (sortKey: string) => {
    logKlikk(`agreements-sort-${sortKey}`)
    setSortColumn({
      orderBy: sortKey === sortColumn.orderBy && sortColumn.direction === 'descending' ? 'title' : sortKey,
      direction:
        sortKey === sortColumn.orderBy
          ? sortColumn.direction === 'ascending'
            ? 'descending'
            : 'ascending'
          : 'ascending',
    })
  }

  const iconBasedOnState = (key: string) => {
    return sortColumn.orderBy === key ? (
      sortColumn.direction === 'ascending' ? (
        <ArrowUpIcon title="Sort ascending" height={30} width={30} aria-hidden={true} />
      ) : (
        <ArrowDownIcon title="Sort descending" height={30} width={30} aria-hidden={true} />
      )
    ) : (
      <ArrowsUpDownIcon title="Sort direction not set" height={30} width={30} aria-hidden={true} />
    )
  }

  return (
    <VStack gap="4" paddingInline={{ lg: '6' }}>
      <HGrid columns={{ xs: '1', lg: '4fr 1fr 1fr' }} gap="2" align="center" className="agreement-page__list-container">
        <Heading level="2" size="medium">
          Hjelpemidler på avtale med Nav
        </Heading>
        <Hide below="lg" asChild>
          <Button
            className={classNames('agreement-page__sort-button', {
              'agreement-page__sort-selected': sortColumn.orderBy === 'published',
            })}
            aria-label={
              sortColumn.orderBy === 'published'
                ? getAriaLabel({
                    sortColumns: sortColumn,
                    ariaLabelKey: 'Aktiv fra dato ',
                  })
                : defaultAriaLabel + ' aktiv fra dato'
            }
            aria-pressed={sortColumn.orderBy === 'published'}
            size="xsmall"
            variant="tertiary"
            onClick={() => handleSortColumn('published')}
            iconPosition="right"
            icon={iconBasedOnState('published')}
            style={{ justifySelf: 'center' }}
          >
            Aktiv fra
          </Button>
        </Hide>
        <Hide below="lg" asChild>
          <Button
            className={classNames('agreement-page__sort-button', {
              'agreement-page__sort-selected': sortColumn.orderBy === 'expires',
            })}
            aria-label={
              sortColumn.orderBy === 'expires'
                ? getAriaLabel({
                    sortColumns: sortColumn,
                    ariaLabelKey: 'Aktiv til dato ',
                  })
                : defaultAriaLabel + ' aktiv til dato'
            }
            aria-pressed={sortColumn.orderBy === 'expires'}
            size="xsmall"
            variant="tertiary"
            onClick={() => handleSortColumn('expires')}
            iconPosition="right"
            icon={iconBasedOnState('expires')}
            style={{ justifySelf: 'center' }}
          >
            Aktiv til
          </Button>
        </Hide>
      </HGrid>

      <VStack as="ol" id="agreement-list" className="agreement-page__list-container">
        {sortedData.map((label) => (
          <AgreementRow label={label} key={label.identifier} />
        ))}
      </VStack>
    </VStack>
  )
}

const AgreementRow = ({ label }: { label: AgreementLabel }) => {
  return (
    <Box as="li" className="agreement-page__list-item">
      <HGrid columns={{ xs: 'auto 30px', lg: '4fr 1fr 1fr' }} gap="2" align="center" className={styles.agreementRow}>
        <HStack align={'center'}>
          <Link
            as={NextLink}
            href={agreementProductsLink(label.id)}
            onClick={() => logNavigationEvent('forside', 'hurtigoversikt', label.title)}
          >
            {`${label.title} `}
          </Link>
        </HStack>
        <Hide below="lg" asChild>
          <BodyShort style={{ justifySelf: 'center' }}>{`${dateToString(label.published)}`}</BodyShort>
        </Hide>
        <Hide below="lg" asChild>
          <BodyShort style={{ justifySelf: 'center' }}>{`${dateToString(label.expires)}`}</BodyShort>
        </Hide>
        <Show below="lg" asChild>
          <ChevronRightIcon aria-hidden fontSize={'1.55rem'} />
        </Show>
      </HGrid>
    </Box>
  )
}

export default Agreements
