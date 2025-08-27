'use client'

import { Product } from '@/utils/product-util'
import { BodyLong, BodyShort, Box, Button, Heading, HStack, VStack } from '@navikt/ds-react'
import styles from './Hackathon.module.css'
import ProductImage from '@/components/ProductImage'
import NextLink from 'next/link'

export const Hackathon = ({ product }: { product: Product }) => {
  return (
    <VStack gap={'8'} className={styles.wrapper}>
      <HStack align={'center'}>
        <Box className={styles.imageWrapper}>
          <ProductImage src={product.photos.at(0)?.uri} productTitle={product.title} />
        </Box>
        <VStack gap={'4'}>
          <Heading size={'small'}>Rullatorer, 4 hjul innendørsbruk, begrenset utebruk</Heading>
          <Heading size={'large'}>{product.title}</Heading>
          <BodyShort>Artnr: 177946</BodyShort>
        </VStack>
      </HStack>
      <VStack gap={'2'}>
        <Heading size={'small'}>Om hjelpemiddelet</Heading>
        <BodyLong style={{ maxWidth: '600px' }}>{product.attributes.text}</BodyLong>
      </VStack>
      <VStack gap={'2'}>
        <Heading size={'small'}>Problemer med hjelpemiddelet</Heading>
        <HStack gap={'2'} paddingBlock={'6 0'}>
          <Button as={NextLink} href={`/hackathon/${product.id}/returner`}>
            Jeg trenger den ikke lenger
          </Button>
          <Button as={NextLink} href={`/hackathon/${product.id}/problem`}>
            Den virker ikke
          </Button>
        </HStack>
      </VStack>
    </VStack>
  )
}
