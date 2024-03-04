'use client'

import { AgreementLabel } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { dateToString } from '@/utils/string-util'
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons'
import { Alert, BodyShort, Box, Button, HGrid, HStack, Heading, Link, Loader, Show, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const AgreementList = () => {
  const [sortColumn, setSortColumn] = useState<SortColumns>({ orderBy: 'title', direction: 'descending' })
  const { data, error } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
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
      sorted.sort((a, b) => sortAlphabetically(a.label, b.label, sortColumn.direction === 'ascending'))
    }

    return sorted
  }, [data, sortColumn])

  const handleSortColumn = (sortKey: string) => {
    setSortColumn({
      orderBy: sortKey,
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
        <ArrowUpIcon title="Sort ascending" height={30} width={30} />
      ) : (
        <ArrowDownIcon title="Sort descending" height={30} width={30} />
      )
    ) : (
      <ArrowsUpDownIcon title="Sort direction not set" height={30} width={30} />
    )
  }

  return (
    <>
      <Heading level="2" size="large" className="spacing-bottom--small" id="alle-avtaler">
        Alle avtaler
      </Heading>
      <BodyShort spacing>
        {`Her finner du alle aktive avtaler NAV har. Under hver enkelt avtale finner man tilbehør, tjenester, reservedeler
        og dokumenter som "Behov og kravspesifikasjon".`}
      </BodyShort>

      <HGrid columns={{ xs: '1fr 1fr 1fr', md: '4fr 1fr 1fr' }} align="center" className="agreement-page__list-header">
        <Button
          className={classNames('agreement-page__sort-button', {
            'agreement-page__sort-selected': sortColumn.orderBy === 'title',
          })}
          aria-label="Sorter på tittel"
          aria-selected={sortColumn.orderBy === 'title'}
          size="xsmall"
          variant="tertiary"
          onClick={() => handleSortColumn('title')}
          iconPosition="right"
          icon={iconBasedOnState('title')}
        >
          Tittel
        </Button>
        <Button
          className={classNames('agreement-page__sort-button agreement-page__sort-button-published', {
            'agreement-page__sort-selected': sortColumn.orderBy === 'published',
          })}
          aria-label="Sorter på publisert dato"
          aria-selected={sortColumn.orderBy === 'published'}
          size="xsmall"
          variant="tertiary"
          onClick={() => handleSortColumn('published')}
          iconPosition="right"
          icon={iconBasedOnState('published')}
        >
          <Show above="md">Aktiv fra</Show>
          <Show below="md">Fra</Show>
        </Button>
        <Button
          className={classNames('agreement-page__sort-button agreement-page__sort-button-expires', {
            'agreement-page__sort-selected': sortColumn.orderBy === 'expires',
          })}
          aria-label="Sorter på tittel"
          aria-selected={sortColumn.orderBy === 'expires'}
          size="xsmall"
          variant="tertiary"
          onClick={() => handleSortColumn('expires')}
          iconPosition="right"
          icon={iconBasedOnState('expires')}
        >
          <Show above="md">Aktiv til</Show>
          <Show below="md">Til</Show>
        </Button>
      </HGrid>

      <VStack as="ol" gap="4" id="agreement-list" className="agreement-page__list-container">
        {data &&
          sortedData.map((label) => (
            <Box as="li" key={label.identifier} borderRadius="medium" borderColor="border-subtle" borderWidth="1">
              <HGrid columns={{ xs: '1', md: '4fr 1fr 1fr' }} align="center">
                <Link as={NextLink} href={`/rammeavtale/${label.id}`}>
                  {`${label.label} `}
                </Link>
                <BodyShort>{`Fra ${dateToString(label.published)}`}</BodyShort>
                <BodyShort>{`Til ${dateToString(label.expires)}`}</BodyShort>
              </HGrid>
            </Box>
          ))}
        {error && <Alert variant="warning">Obs, her mangler det noe data :o</Alert>}
        {!data && (
          <HStack justify="center" style={{ marginTop: '18px' }}>
            <Loader size="xlarge" title="Laster produkter" />
          </HStack>
        )}
      </VStack>
    </>
  )
}

export default AgreementList
