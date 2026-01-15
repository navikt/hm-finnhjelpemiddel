import { VStack } from '@navikt/ds-react'

async function CategoryAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      gap={'8'}
      paddingBlock={'0 16'}
      paddingInline={'4'}
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'900px'}
    >
      {children}
    </VStack>
  )
}

export default CategoryAdminLayout
