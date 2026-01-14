import { VStack } from '@navikt/ds-react'

async function CategoryAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <VStack gap={'2'} padding={'4'}>
      {children}
    </VStack>
  )
}

export default CategoryAdminLayout
