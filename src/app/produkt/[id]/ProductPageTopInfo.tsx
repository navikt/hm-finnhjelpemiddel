import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, Heading } from '@/components/aksel-client'

import { HGrid, HStack, VStack } from '@navikt/ds-react'
import KeyInformation from './KeyInformation'
import PhotoSlider from './PhotoSlider'
import { QrCodeComponent } from './QrCode'

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

  return (
    <>
      <HGrid
        columns={{ xs: '1fr', md: '500px  390px' }}
        aria-label="Bilder og nøkkelinformasjon"
        className="product-info__top-page-container"
        gap={{ xs: '4', md: '10' }}
      >
        <div className="product-info__photo-slider-container">
          {product.photos && <PhotoSlider photos={product.photos} />}
        </div>
        <VStack gap="9" className="spacing-top--medium">
          <VStack gap="3">
            <Heading level="1" size="large">
              {product.title}
            </Heading>
            {rank && <AgreementIcon rank={rank} />}
            {(allVariantsExpiredDates || allVariantsExpired) && (
              <div className="product-info__expired-propducts">
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
