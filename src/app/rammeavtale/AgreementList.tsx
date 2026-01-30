'use client'

import NextLink from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

import { AgreementLabel, agreementProductsLink } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { defaultAriaLabel, getAriaLabel } from '@/utils/ariaLabel-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { dateToString } from '@/utils/string-util'
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon, ChevronRightIcon } from '@navikt/aksel-icons'
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HGrid,
  Hide,
  HStack,
  Link,
  Loader,
  Show,
  VStack,
} from '@navikt/ds-react'

import classNames from 'classnames'

type SortColumns = {
  orderBy: string | null
  direction: 'ascending' | 'descending'
}

const AgreementList = () => {
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
    <VStack gap="space-16">
      <HGrid columns={{ xs: '1', lg: '4fr 1fr 1fr' }} gap="space-8" align="center" className="agreement-page__list-header">
        <Heading level="2" size="medium">
          På avtale med Nav
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
        {data &&
          sortedData.map((label) => (
            <Box as="li" key={label.identifier} className="agreement-page__list-item">
              <HGrid columns={{ xs: 'auto 30px', lg: '4fr 1fr 1fr' }} gap="space-8" align="center">
                {/*<Link as={NextLink} href={`/rammeavtale/hjelpemidler/${label.id}`}>*/}
                <Link as={NextLink} href={agreementProductsLink(label.id)}>
                  {`${label.title} `}
                </Link>
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
          ))}
        {/* {error && <Alert variant="warning">Obs, her mangler det noe data :o</Alert>} */}
      </VStack>
      {!data && (
        <HStack justify="center" style={{ marginTop: '18px' }}>
          <Loader size="xlarge" title="Laster produkter" />
        </HStack>
      )}
      <Alert variant="info">
        Du finner informasjon om andre avtaler her:
        <ul className="spacing-vertical--small">
          <li>
            <Link href="https://www.nav.no/no/person/hjelpemidler/hjelpemidler-og-tilrettelegging/bil-og-spesialutstyr">
              Bil
            </Link>
          </li>
          <li>
            <Link href="https://www.nav.no/no/person/hjelpemidler/hjelpemidler-og-tilrettelegging/bil-og-spesialutstyr/spesialutstyr-og-tilpasning">
              Bilombygg
            </Link>
          </li>
          <li>
            <Link href="https://www.nav.no/forerhund">Førerhund</Link>
          </li>
          <li>
            <Link href="https://www.nav.no/servicehund">Servicehund</Link>
          </li>
          <li>
            <Link href="https://www.hjelpemiddeldatabasen.no/news.asp?newsid=8734&x_newstype=7">
              Høreapparat, ørepropper og tinnitusmaskerere
            </Link>
          </li>
          <li>
            <Link href="https://www.hjelpemiddeldatabasen.no/news.asp?newsid=8669&x_newstype=7">
              Hjelpemidler for seksuallivet
            </Link>
          </li>
        </ul>
      </Alert>
    </VStack>
  );
}

export default AgreementList
