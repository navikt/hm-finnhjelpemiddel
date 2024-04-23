'use client'
import { Button, HGrid } from '@navikt/ds-react'
import classNames from 'classnames'
import NextLink from 'next/link'

const ProductNavigationBar = ({
  hasVariants,
  isOnAgreement,
  hasAccessories,
  hasSpareParts,
}: {
  hasVariants: boolean
  isOnAgreement: boolean
  hasAccessories: boolean
  hasSpareParts: boolean
}) => {
  const bools = [isOnAgreement, hasAccessories, hasSpareParts]
  const numberOfColumns = bools.reduce((acc, bool) => acc + (bool ? 1 : 0), 4)

  const buttonClassName = (buttonName: string) =>
    classNames('product-page__nav-button', { 'navds-button--tertiary:active': true })

  return (
    <HGrid
      className="product-page__nav spacing-top--large"
      columns={{ sm: 'repeat(1, minmax(0, 300px))', md: numberOfColumns }}
      gap={{ xs: '2', lg: '7' }}
    >
      <Button variant="tertiary" className={buttonClassName('informasjon')} as={NextLink} href="#informasjon">
        Generell informasjon
      </Button>
      {/* <Button variant="tertiary" className="product-page__nav-button" as={NextLink} href="#varianter">
            Finn HMS-nummer
          </Button> */}
      {hasVariants ? (
        <Button variant="tertiary" className={buttonClassName('varianter')} as={NextLink} href="#varianter">
          Varianter
        </Button>
      ) : (
        <Button variant="tertiary" className={buttonClassName('egenskaper')} as={NextLink} href="#egenskaper">
          Egenskaper
        </Button>
      )}

      <Button variant="tertiary" className={buttonClassName('videoer')} as={NextLink} href="#videoer">
        Video
      </Button>
      <Button variant="tertiary" className={buttonClassName('dokumenter')} as={NextLink} href="#dokumenter">
        Dokumenter
      </Button>
      {isOnAgreement && (
        <Button variant="tertiary" className={buttonClassName('agreement-info')} as={NextLink} href="#agreement-info">
          Avtale med NAV
        </Button>
      )}

      {hasAccessories && (
        <Button variant="tertiary" className={buttonClassName('tilbehør')} as={NextLink} href="#tilbehør">
          Tilbehør
        </Button>
      )}

      {hasSpareParts && (
        <Button variant="tertiary" className={buttonClassName('reservedeler')} as={NextLink} href="#reservedeler">
          Reservedeler
        </Button>
      )}
    </HGrid>
  )
}

export default ProductNavigationBar
