import { VStack } from '@navikt/ds-react'

async function CategoryAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      gap={"space-32"}
      paddingBlock={"space-0 space-64"}
      paddingInline={"space-16"}
      marginInline={'auto'}
      marginBlock={"space-0"}
      maxWidth={'1280px'}
    >
      {children}
    </VStack>
  );
}

export default CategoryAdminLayout
