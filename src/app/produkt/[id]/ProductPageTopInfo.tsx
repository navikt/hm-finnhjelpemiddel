'use client'

import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, Heading } from '@/components/aksel-client'

import { HGrid, HStack, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import KeyInformation from './KeyInformation'
import PhotoSlider from './PhotoSlider'
import { QrCodeComponent } from './QrCode'
import { useFlag } from "@/toggles/context";

type ProductPageTopInfoProps = {
  product: Product
  supplier: Supplier
}

const ProductPageTopInfo = ({ product, supplier }: ProductPageTopInfoProps) => {
  const minRank =
    product.agreements &&
    product.agreements?.length > 0 &&
    Math.min(...product.agreements.map((agreement) => agreement.rank))
  const rank = product.agreements?.length === 1 ? product.agreements[0].rank : minRank
  const allVariantsExpired = product.variants.every((variant) => variant.status === 'INACTIVE')
  const allVariantsExpiredDates = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  const flag = useFlag("adminreg.test")
  return (
    <>
      {flag.enabled && <div>{flag.name} is enabled</div>}
      <HGrid
        columns={{ xs: '1fr', md: '500px  390px' }}
        aria-label="Bilder og nøkkelinformasjon"
        className={classNames('product-page__top-page-container', {
          'not-on-agreement-or-expired':
            product.agreements?.length === 0 && (!allVariantsExpiredDates || !allVariantsExpired),
        })}
        gap={{ xs: '4', md: '10' }}
      >
        <div className="product-page__photo-slider-container">
          {product.photos && <PhotoSlider photos={product.photos} />}
        </div>
        <VStack gap="9" className="spacing-top--medium">
          <VStack gap="3">
            <Heading level="1" size="large">
              {product.title}
            </Heading>
            {rank && <AgreementIcon rank={rank} />}
            {(allVariantsExpiredDates || allVariantsExpired) && (
              <div className="product-page__expired-propducts">
                <Alert variant="warning">Dette produktet er utgått</Alert>
              </div>
            )}
          </VStack>

          <KeyInformation product={product} supplier={supplier ? supplier : null} />
          <HStack gap="3">
            <QrCodeComponent value={product.id} />
            {/* <Button variant="secondary" icon={<ArrowsSquarepathIcon />}>
              Sammenlign
            </Button> */}
          </HStack>
        </VStack>
      </HGrid>
    </>
  )
}

export default ProductPageTopInfo
