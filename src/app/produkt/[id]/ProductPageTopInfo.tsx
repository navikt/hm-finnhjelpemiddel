import { headers } from 'next/dist/client/components/headers'

import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, BodyShort, Heading } from '@/components/aksel-client'

import InformationTabs, { InformationAccordion } from './InformationTabs'
import KeyInformation from './KeyInformation'
import PhotoSlider from './PhotoSlider'
import { QrCodeComponent } from '@/app/produkt/[id]/QrCode'

type ProductPageTopInfoProps = {
  product: Product
  supplier: Supplier
}

const ProductPageTopInfo = ({ product, supplier }: ProductPageTopInfoProps) => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobileDevice = /Mobile|webOS|Android|iOS|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent || '')

  const minRank =
    product.agreements &&
    product.agreements?.length > 0 &&
    Math.min(...product.agreements.map((agreement) => agreement.rank))
  const rank = product.agreements?.length === 1 ? product.agreements[0].rank : minRank
  const agreementRankText =
    typeof rank === 'number' ? `Rangert som nr ${rank} på avtale med NAV.` : 'Er på avtale med NAV uten rangering.'
  const allVariantsExpired = product.variants.every((variant) => variant.status === 'INACTIVE')
  const allVariantsExpiredDates = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  return (
    <>
      <section className="product-info__top" aria-label="Bilder og nøkkelinformasjon">
        <div className="product-info__top-content">
          <div className="product-info__top-left">{product.photos && <PhotoSlider photos={product.photos} />}</div>
          <div className="product-info__top-right">
            <Heading level="1" size="large" spacing>
              {product.title}
            </Heading>
            {(allVariantsExpiredDates || allVariantsExpired) && (
              <div className="product-info__expired-propducts">
                <Alert variant="warning">Dette produktet er utgått</Alert>
              </div>
            )}
            {rank && (
              <div className="product-info__agreement-rank">
                {<AgreementIcon rank={rank} />}
                <BodyShort>{agreementRankText}</BodyShort>
              </div>
            )}

            <KeyInformation product={product} supplierName={supplier ? supplier.name : null} />
            <QrCodeComponent value={product.id} />
          </div>
        </div>
      </section>
      <section className="product-info__tabs" aria-label="Produktbeskrivelse og medfølgende dokumenter">
        {isMobileDevice ? (
          <InformationAccordion product={product} supplier={supplier} />
        ) : (
          <InformationTabs product={product} supplier={supplier} />
        )}
      </section>
    </>
  )
}

export default ProductPageTopInfo
