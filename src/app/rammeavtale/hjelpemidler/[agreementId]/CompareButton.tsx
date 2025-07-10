import { Product } from '@/utils/product-util'
import { useHydratedCompareStore } from '@/utils/global-state-util'
import { Button } from '@navikt/ds-react'
import classNames from 'classnames'
import styles from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardAgreement.module.scss'
import { ArrowRightLeftIcon } from '@navikt/aksel-icons'

export const CompareButton = ({
  product,
  handleCompareClick,
}: {
  product: Product
  handleCompareClick: (() => void) | undefined
}) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()

  const toggleCompareProduct = () => {
    handleCompareClick && handleCompareClick()
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product.id)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  return (
    <Button
      className={classNames(styles.compareButton, {
        [styles.compareButtonChecked]: isInProductsToCompare,
      })}
      size="xsmall"
      variant="secondary-neutral"
      value="Legg produktet til sammenligning"
      onClick={toggleCompareProduct}
      icon={<ArrowRightLeftIcon aria-hidden fontSize={'24px'} />}
      iconPosition="left"
      aria-pressed={isInProductsToCompare}
    >
      Sammenlign
    </Button>
  )
}
