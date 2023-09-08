import { headers } from 'next/dist/client/components/headers'

import { Agreement } from '@/utils/agreement-util'
import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, BodyShort, Heading } from '@/components/aksel-client'

import InformationTabs, { InformationAccordion } from './InformationTabs'
import KeyInformation from './KeyInformation'
import PhotoSlider from './PhotoSlider'

type ProductPageTopInfoProps = {
  product: Product
  supplier: Supplier
  agreement: Agreement | null
}

const ProductPageTopInfo = ({ product, supplier, agreement }: ProductPageTopInfoProps) => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobileDevice = /Mobile|webOS|Android|iOS|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent || '')
  return (
    <>
      <section className="product-info__top" aria-label="Bilder og nøkkelinformasjon">
        <div className="product-info__top-content max-width">
          <div className="product-info__top-left">{product.photos && <PhotoSlider photos={product.photos} />}</div>
          <div className="product-info__top-right">
            <Heading level="1" size="large" spacing>
              {product.title}
            </Heading>
            {/* TODO: check all expired dates */}
            {new Date(product.variants[0].expired).getTime() <= Date.now() ? (
              <div className="product-info__expired-propducts">
                <Alert variant="warning">Dette produktet er utgått</Alert>
              </div>
            ) : (
              ''
            )}
            {product.applicableAgreementInfo && (
              <div className="product-info__agreement-rank">
                <AgreementIcon rank={product.applicableAgreementInfo.rank} />
                <BodyShort>Rangert som nr {product.applicableAgreementInfo.rank} på avtale med Nav</BodyShort>
              </div>
            )}

            <KeyInformation
              product={product}
              supplierName={supplier ? supplier.name : null}
              agreementTitle={agreement ? agreement.title : null}
            />
          </div>
        </div>
      </section>
      <section className="product-info__tabs max-width" aria-label="Produktbeskrivelse og medfølgende dokumenter">
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
