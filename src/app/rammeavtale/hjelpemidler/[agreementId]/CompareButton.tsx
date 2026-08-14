import { useState } from 'react'

import classNames from 'classnames'

import { ArrowRightLeftIcon } from '@navikt/aksel-icons'
import { Button, Popover } from '@navikt/ds-react'

import { CompareMenuState, useHydratedCompareStore } from '@/utils/global-state-util'
import { Product } from '@/utils/product-util'

import styles from '@/app/rammeavtale/hjelpemidler/[agreementId]/ProductCardAgreement.module.scss'

export const CompareButton = ({ product }: { product: Product }) => {
  const { setProductToCompare, removeProduct, productsToCompare } = useHydratedCompareStore()
  const [showPopover, setShowPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const { setCompareMenuState } = useHydratedCompareStore()
  const [firstCompareClick, setFirstCompareClick] = useState(true)
  const handleCompareClick = () => {
    if (firstCompareClick) {
      setCompareMenuState(CompareMenuState.Open)
    }
    setFirstCompareClick(false)
  }

  const toggleCompareProduct = () => {
    handleCompareClick && handleCompareClick()
    productsToCompare.filter((procom: Product) => product.id === procom.id).length === 1
      ? removeProduct(product.id)
      : setProductToCompare(product)
  }

  const isInProductsToCompare = productsToCompare.filter((procom: Product) => product.id === procom.id).length >= 1

  return (
    <>
      <Button
        className={classNames(styles.compareButton, {
          [styles.compareButtonChecked]: isInProductsToCompare,
        })}
        ref={setAnchorEl}
        size="xsmall"
        variant="tertiary-neutral"
        value="Legg produktet til sammenligning"
        onClick={() => {
          if (productsToCompare.length >= 5 && !isInProductsToCompare) {
            setShowPopover(true)
          } else {
            toggleCompareProduct()
          }
        }}
        icon={<ArrowRightLeftIcon aria-hidden fontSize={'16px'} />}
        iconPosition="left"
        aria-pressed={isInProductsToCompare}
      >
        Sammenlign
      </Button>
      <Popover open={showPopover} onClose={() => setShowPopover(false)} anchorEl={anchorEl}>
        <Popover.Content>Kan ikke sammenlikne mer enn 5 produkter</Popover.Content>
      </Popover>
    </>
  )
}
