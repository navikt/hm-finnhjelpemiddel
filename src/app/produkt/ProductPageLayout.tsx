import { VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'

export const ProductPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <VStack
      gap={'14'}
      paddingBlock={'16'}
      paddingInline={'4'}
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1200px'}
    >
      {children}
    </VStack>
  )
}
