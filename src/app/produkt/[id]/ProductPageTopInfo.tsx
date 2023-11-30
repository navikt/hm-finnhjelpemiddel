import { headers } from 'next/dist/client/components/headers'

import { Agreement } from '@/utils/agreement-util'
import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, BodyShort, Heading } from '@/components/aksel-client'

import InformationTabs, { InformationAccordion } from './InformationTabs'
import KeyInformation from './KeyInformation'
import PhotoSlider from './PhotoSlider'
import { QrCodeComponent } from "@/app/produkt/[id]/QrCode";

type ProductPageTopInfoProps = {
  product: Product
  supplier: Supplier
  agreement: Agreement | null
}

const ProductPageTopInfo = ({product, supplier, agreement}: ProductPageTopInfoProps) => {
  const headersList = headers()
  const userAgent = headersList.get('user-agent')
  const isMobileDevice = /Mobile|webOS|Android|iOS|iPhone|iPod|BlackBerry|Windows Phone/i.test(userAgent || '')
  const agreementRankText = product.applicableAgreementInfo?.rank
    ? `Rangert som nr ${product.applicableAgreementInfo?.rank} på avtale med Nav.`
    : 'Er på avtale med NAV uten rangering.'

  return (
    <>
      <section className="product-info__top" aria-label="Bilder og nøkkelinformasjon">
        <div className="product-info__top-content">
          <div className="product-info__top-left">{product.photos && <PhotoSlider photos={product.photos}/>}</div>
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
                <AgreementIcon rank={product.applicableAgreementInfo.rank}/>
                <BodyShort>{agreementRankText}</BodyShort>
              </div>
            )}

            <KeyInformation
              product={product}
              supplierName={supplier ? supplier.name : null}
              agreementTitle={agreement ? agreement.title : null}
            />
            <QrCodeComponent value={product.id}/>
          </div>
        </div>
      </section>
      <section className="product-info__tabs" aria-label="Produktbeskrivelse og medfølgende dokumenter">
        {isMobileDevice ? (
          <InformationAccordion product={product} supplier={supplier}/>
        ) : (
          <InformationTabs product={product} supplier={supplier}/>
        )}
      </section>
    </>
  )
}

export default ProductPageTopInfo
