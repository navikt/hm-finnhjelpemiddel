import { Alert, BodyLong, Heading, HStack, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  error?: boolean
  children: ReactNode
}

export const KategoriPageLayout = ({ title, description, error, children }: Props) => {
  if (error) console.debug(error)
  return (
    <VStack
      gap={'space-32'}
      paddingBlock={{ xs: 'space-16', md: 'space-80 space-64' }}
      paddingInline={{ xs: 'space-16', lg: 'space-0' }}
      marginInline={'auto'}
      marginBlock={'space-0'}
      maxWidth={'1024px'}
    >
      <VStack gap="space-8">
        <Heading level="1" size="xlarge">
          {title}
        </Heading>
        <BodyLong size={'large'} style={{ maxWidth: '735px' }}>
          {description}
        </BodyLong>
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
