import { VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'

export const ProductPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <VStack
      gap={"space-56"}
      paddingBlock={"space-64"}
      paddingInline={"space-16"}
      marginInline={'auto'}
      marginBlock={"space-0"}
      maxWidth={'1200px'}
    >
      {children}
    </VStack>
  );
}
