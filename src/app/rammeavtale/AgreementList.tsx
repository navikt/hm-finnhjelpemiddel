'use client'

import { AgreementLabel } from '@/utils/agreement-util'
import { logKlikk } from '@/utils/amplitude'
import { getAgreementLabels } from '@/utils/api-util'
import { defaultAriaLabel, getAriaLabel } from '@/utils/ariaLabel-util'
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
  const [sortColumn, setSortColumn] = useState<SortColumns>({ orderBy: 'title', direction: 'ascending' })
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
      sorted.sort((a, b) => sortAlphabetically(a.label, b.label, sortColumn.direction === 'descending'))
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
    <VStack gap="4">
      <HGrid columns={{ xs: '1fr 1fr 1fr', md: '4fr 1fr 1fr' }} align="center" className="agreement-page__list-header">
        <Heading level="2" size="medium">
          På avtale med NAV
        </Heading>
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
          aria-selected={sortColumn.orderBy === 'published'}
          size="xsmall"
          variant="tertiary"
          onClick={() => handleSortColumn('published')}
          iconPosition="right"
          icon={iconBasedOnState('published')}
          style={{ justifySelf: 'center' }}
        >
          <Show above="md">Aktiv fra</Show>
          <Show below="md">Fra</Show>
        </Button>
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
          aria-selected={sortColumn.orderBy === 'expires'}
          size="xsmall"
          variant="tertiary"
          onClick={() => handleSortColumn('expires')}
          iconPosition="right"
          icon={iconBasedOnState('expires')}
          style={{ justifySelf: 'center' }}
        >
          <Show above="md">Aktiv til</Show>
          <Show below="md">Til</Show>
        </Button>
      </HGrid>

      <VStack as="ol" id="agreement-list" className="agreement-page__list-container">
        {data &&
          sortedData.map((label) => (
            <Box as="li" key={label.identifier}>
              <HGrid columns={{ xs: '1', md: '4fr 1fr 1fr' }} align="center">
                <Link as={NextLink} href={`/rammeavtale/${label.id}`}>
                  {`${label.label} `}
                </Link>
                <BodyShort style={{ justifySelf: 'center' }}>{`${dateToString(label.published)}`}</BodyShort>
                <BodyShort style={{ justifySelf: 'center' }}>{`${dateToString(label.expires)}`}</BodyShort>
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
    </VStack>
  )
}

export default AgreementList
