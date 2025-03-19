'use client'

import { Alert, Bleed, BodyShort, Box, Button, Heading, HGrid, Table, VStack } from '@navikt/ds-react'
import { ChevronRightIcon, LayersPlusIcon } from '@navikt/aksel-icons'
import styles from './productmiddle.module.scss'
import { Product } from '@/utils/product-util'
import { ProductInformation } from '@/app/ny/produkt/[id]/ProductInformation'

type Props = {
  product: Product
}

const ProductMiddle = ({ product }: Props) => {
  const commonDataRows = { ['key']: 'value', ['key2']: 'value', ['key3']: 'value', ['key4']: 'value' }
  const post = product.agreements[0].postTitle
  return (
    <Bleed reflectivePadding marginInline="full" className={styles.middleContainer}>
      <HGrid gap={'8'} columns={2}>
        <ProductInformation product={product} />
        <AccessoriesAndParts productName={product.title} accessoriesLink={'testaccessories'} />
        <SharedVariantDataTable2 commonDataRows={commonDataRows} />
        <OtherProductsOnPost postName={post} postLink={'testpost'} />
      </HGrid>
    </Bleed>
  )
}

type AccessoriesAndPartsProps = {
  productName: string
  accessoriesLink: string
}
const AccessoriesAndParts = ({ productName, accessoriesLink }: AccessoriesAndPartsProps) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'small'} level={'3'}>
        Passer sammen med
      </Heading>
      <BodyShort>Har finner du en liste over tilbehører og reserverveler som passer til {productName}.</BodyShort>
      <Button variant={'secondary'} icon={<LayersPlusIcon />} style={{ width: 'fit-content' }}>
        Tilbehør og reservedeler
      </Button>
    </VStack>
  )
}

interface SharedVariantDataTableProps {
  commonDataRows: { [key: string]: string }
}

const SharedVariantDataTable2 = ({ commonDataRows }: SharedVariantDataTableProps) => {
  return (
    <VStack>
      <Heading level="3" size="small">
        Felles egenskaper for denne serien
      </Heading>
      <Box paddingBlock="4">
        {Object.keys(commonDataRows).length === 0 ? (
          <Alert variant={'info'} inline>
            Ingen felles egenskaper
          </Alert>
        ) : (
          <Table className={styles.commonAttributes}>
            <Table.Body>
              {Object.entries(commonDataRows).map(([key, row]) => {
                return (
                  <Table.Row key={key}>
                    <Table.HeaderCell>{key}</Table.HeaderCell>
                    <Table.DataCell>{row}</Table.DataCell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        )}
      </Box>
    </VStack>
  )
}

type OtherProductsOnPostProps = {
  postName: string
  postLink: string
}
const OtherProductsOnPost = ({ postName, postLink }: OtherProductsOnPostProps) => {
  return (
    <VStack gap={'2'}>
      <Heading size={'small'} level={'3'}>
        Andre manuelle rullestoler på delkontrakt {postName}
      </Heading>
      <Button variant={'secondary'} icon={<ChevronRightIcon />} style={{ width: 'fit-content' }}>
        Flere produkter på delkontrakt
      </Button>
    </VStack>
  )
}
export default ProductMiddle
