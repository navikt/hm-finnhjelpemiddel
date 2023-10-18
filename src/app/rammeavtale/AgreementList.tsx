'use client'

import { AgreementLabel, agreementKeyLabels } from '@/utils/agreement-util'
import { getAgreementLabels } from '@/utils/api-util'
import { sortAlphabetically } from '@/utils/sort-util'
import { Heading, LinkPanel } from '@navikt/ds-react'
import { Combobox } from '@navikt/ds-react/esm/form/combobox'
import { useMemo } from 'react'
import useSWR from 'swr'

const AgreementList = () => {
  // const agreements = mapAgreementFromSearch(await getAgreementFromId())
  // const hrefSok = `/sok?agreement=true&rammeavtale=${agreement?.label}`
  // let hrefAgreement = `/rammeavtale/${id}`
  const { data, error } = useSWR<AgreementLabel[]>('/agreements/_search', getAgreementLabels, {
    keepPreviousData: true,
  })

  const sortedData = useMemo(() => {
    if (!data) return []
    const sorted = [...data] // Create a copy of data to avoid modifying it in place
    sorted.sort((a, b) => {
      const labelA = agreementKeyLabels[a.identifier]
      const labelB = agreementKeyLabels[b.identifier]

      if (labelA && labelB) {
        return sortAlphabetically(labelA, labelB)
      } else {
        // Handle cases where identifier does not exist in agreementKeyLabels
        return 0 // No change in order
      }
    })
    return sorted
  }, [data])

  return (
    <>
      <Heading level="1" size="medium">
        Aktive avtaler
      </Heading>
      {data &&
        sortedData.map((label) => (
          <LinkPanel key={label.identifier} href={`/rammeavtale/${label.id}`}>
            {label.label}
          </LinkPanel>
        ))}
      {/* <Combobox></Combobox> */}
    </>
  )
}

export default AgreementList
