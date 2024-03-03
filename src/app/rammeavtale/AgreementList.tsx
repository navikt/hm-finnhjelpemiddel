'use client'

import { AgreementLabel } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { dateToString } from '@/utils/string-util'
import {
  Alert,
  BodyShort,
  Box,
  Detail,
  HGrid,
  HStack,
  Heading,
  Link,
  Loader,
  Select,
  Show,
  VStack,
} from '@navikt/ds-react'
import NextLink from 'next/link'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

const AgreementList = () => {
  const [sortBy, setSortBy] = useState<string>('title')
  const { data, error } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place

    if (sortBy === 'published') {
      sorted.sort((a, b) => b.published.getTime() - a.published.getTime())
    } else if (sortBy === 'expires') {
      sorted.sort((a, b) => a.expires.getTime() - b.expires.getTime())
    } else {
      sorted.sort((a, b) => sortAlphabetically(a.label, b.label))
    }

    return sorted
  }, [data, sortBy])

  const handleSelectedSorting = (event: React.FormEvent<HTMLSelectElement>) => {
    setSortBy(event.currentTarget.value)
  }

  return (
    <>
      <Heading level="2" size="large" className="spacing-bottom--small" id="alle-avtaler">
        Alle avtaler
      </Heading>
      <BodyShort>
        Her finner du alle aktive avtaler NAV har. Under hver enkelt avtale finner man tilbehør, tjenester, reservedeler
        og dokumenter som "Behov og kravspesifikasjon".
      </BodyShort>
      {/* TODO <Combobox></Combobox> */}
      <Select
        label="Sorter avtalene basert på"
        onChange={handleSelectedSorting}
        size="small"
        style={{ maxWidth: '220px' }}
        aria-controls="agreement-list"
        className="spacing-vertical--small"
      >
        <option value="title">Tittel</option>
        <option value="published">Nyeste</option>
        <option value="expires">Utgår snart</option>
      </Select>

      <Show above="md">
        <HGrid columns={{ xs: '1', md: '4fr 1fr 1fr' }} align="center" className="agreement-page__list-header">
          <Detail>Tittel</Detail>
          <Detail>Aktiv fra</Detail>
          <Detail>Aktiv til</Detail>
        </HGrid>
      </Show>
      <VStack as="ol" gap="4" id="agreement-list" className="agreement-page__list-container">
        {data &&
          sortedData.map((label) => (
            <Box as="li" borderRadius="medium" borderColor="border-subtle" borderWidth="1">
              <HGrid columns={{ xs: '1', md: '4fr 1fr 1fr' }} align="center">
                <Link as={NextLink} key={label.identifier} href={`/rammeavtale/${label.id}`}>
                  {/* TODO: Label eller title her? {label.title} */}
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
