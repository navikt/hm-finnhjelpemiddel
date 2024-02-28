import { smallImageLoader } from '@/utils/image-util'
import { Loader } from '@navikt/ds-react'
import Image from 'next/image'
import { useState } from 'react'

const ProductImage = ({ src, productTitle }: { src: string | undefined; productTitle: string }) => {
  const [loadingError, setLoadingError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const image =
    !loadingError && src ? (
      <>
        {isLoading && <Loader size="large" />}
        <Image
          loader={smallImageLoader}
          src={src}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setLoadingError(true)
            setIsLoading(false)
          }}
          alt={'Produktbilde ' + productTitle}
          fill
          style={{ objectFit: 'contain', padding: '5px', opacity: !isLoading ? 1 : 0 }}
          sizes="50vw"
          priority
        />
      </>
    ) : (
      <Image
        src={'/assets/image-error.png'}
        alt={'Produktbilde mangler for' + productTitle}
        fill
        style={{ padding: '30px' }}
        sizes="50vw"
        priority
      />
    )

  return (
    <div className="product-card-image-container">
      <div className="product-card-image">{image}</div>
    </div>
  )
}

export default ProductImage
