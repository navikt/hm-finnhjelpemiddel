import { Alert, BodyLong, Heading, HStack, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  error?: boolean
  children: ReactNode
}

export const KategoriPageLayout = ({ title, description, error, children }: Props) => {
  return (
    <VStack
      gap={'12'}
      paddingBlock={'16 0'}
      paddingInline={'4'}
      marginInline={'auto'}
      marginBlock={'0'}
      maxWidth={'1440px'}
    >
      <VStack gap="4">
        <Heading level="1" size="large">
          {title}
        </Heading>
        <BodyLong style={{ maxWidth: '735px' }}>{description}</BodyLong>
      </VStack>

      {error ? (
        <HStack justify="center" style={{ marginTop: '48px' }}>
          <Alert variant="error" title="Error med lasting av produkter">
            Obs, her skjedde det noe feil :o
          </Alert>
        </HStack>
      ) : (
        children
      )}
    </VStack>
  )
}
