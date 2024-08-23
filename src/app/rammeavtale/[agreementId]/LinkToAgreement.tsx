'use client'

import { logNavigationEvent } from '@/utils/amplitude'
import { LinkPanel } from '@navikt/ds-react'

export const LinkToAgreement = ({
  hrefHurtigoversikt,
  agreementLabel,
}: {
  hrefHurtigoversikt: string
  agreementLabel: string
}) => (
  <LinkPanel
    href={hrefHurtigoversikt}
    className="agreement-page__link-to-search"
    onClick={() => logNavigationEvent('rammeavtale', 'hurtigoversikt', 'Tilbehør, reservedeler og dokumenter med mer')}
  >
    Produkter: {agreementLabel}
  </LinkPanel>
)

export default LinkToAgreement
