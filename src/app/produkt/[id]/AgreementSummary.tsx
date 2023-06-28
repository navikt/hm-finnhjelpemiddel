'use client'

import { useRouter } from 'next/navigation'

import { ArrowDownIcon } from '@navikt/aksel-icons'
import { BodyShort, Button } from '@navikt/ds-react'

import { Product } from '@/utils/product-util'

import AgreementIcon from '@/components/AgreementIcon'

export const AgreementSummary = ({ product }: { product: Product }) => {
  const router = useRouter()

  if (!product.agreementInfo) {
    return null
  }

  return (
    <div className="agreement-summary">
      <AgreementIcon rank={product.agreementInfo.rank} />
      <div className="agreement-summary__content">
        <BodyShort>Produktet er nr. {product.agreementInfo.rank} på avtale med NAV</BodyShort>
        <Button
          variant="tertiary"
          icon={<ArrowDownIcon />}
          iconPosition="right"
          size="small"
          onClick={() => router.push(`/produkt/${product.id}#agreement-info`)}
        >
          Les mer om avtalen lenger ned
        </Button>
      </div>
    </div>
  )
}
