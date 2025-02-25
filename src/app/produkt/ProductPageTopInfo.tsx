import { Product } from '@/utils/product-util'
import { Supplier } from '@/utils/supplier-util'

import AgreementIcon from '@/components/AgreementIcon'
import { Alert, Heading } from '@/components/aksel-client'

import { HStack, VStack } from '@navikt/ds-react'
import classNames from 'classnames'
import KeyInformation from './KeyInformation'
import { QrCodeComponent } from './QrCode'
import ImageCarousel from '@/app/produkt/ImageCarousel'

type ProductPageTopInfoProps = {
  product: Product
  supplier: Supplier
  hmsArtNr?: string
}

const ProductPageTopInfo = ({ product, supplier, hmsArtNr }: ProductPageTopInfoProps) => {
  const minRank =
    product.agreements &&
    product.agreements?.length > 0 &&
    Math.min(...product.agreements.map((agreement) => agreement.rank))
  const rank = product.agreements?.length === 1 ? product.agreements[0].rank : minRank
  const allVariantsExpired = product.variants.every((variant) => variant.status === 'INACTIVE')
  const allVariantsExpiredDates = product.variants.every((variant) => new Date(variant.expired).getTime() <= Date.now())

  return (
    <>
      <HStack
        aria-label="Bilder og nøkkelinformasjon"
        className={classNames('product-page__top-page-container', {
          'not-on-agreement-or-expired':
            product.agreements?.length === 0 && (!allVariantsExpiredDates || !allVariantsExpired),
        })}
        gap={{ xs: '4', md: '10' }}
      >
        {product.photos && <ImageCarousel images={product.photos} />}
        <VStack gap="9" maxWidth={'390px'} flexBasis={'60%'}>
          <VStack gap="3">
            <Heading level="1" size="large">
              {hmsArtNr ? product.variants[0].articleName : product.title}
            </Heading>
            {rank && <AgreementIcon rank={rank} />}
            {(allVariantsExpiredDates || allVariantsExpired) && (
              <div className="product-page__expired-propducts">
                <Alert variant="warning">Dette produktet er utgått</Alert>
              </div>
            )}
          </VStack>

          <KeyInformation product={product} supplier={supplier ? supplier : null} hmsArtNr={hmsArtNr} />
          <HStack gap="3">
            {hmsArtNr ? <QrCodeComponent value={hmsArtNr} isVariantPage /> : <QrCodeComponent value={product.id} />}
            {/* <Button variant="secondary" icon={<ArrowsSquarepathIcon />}>
              Sammenlign
            </Button> */}
          </HStack>
        </VStack>
      </HStack>
    </>
  )
}

export default ProductPageTopInfo
