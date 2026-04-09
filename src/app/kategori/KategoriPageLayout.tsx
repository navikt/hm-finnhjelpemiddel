import { Alert, BodyLong, Heading, HStack, Link, ReadMore, VStack } from '@navikt/ds-react'
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
      <ReadMore variant={'moderate'} size={'large'} header={'Hvordan kan du få hjelpemidler?'}>
        Dersom du har en varig og vesentlig nedsatt funksjon på grunn av sykdom, skade eller annen tilstand, kan du søke
        om hjelpemidler fra Nav.
        <br />
        <br />
        I mange tilfeller er det nyttig å samarbeide med en fagperson i kommunen for å komme frem til det til det mest
        hensiktsmessige hjelpemidlet, og å skrive selve søknaden.
        <br />
        <br />
        Du kan lese mer hva du kan få og hvordan du skal søke under «Slik går du frem» på nav.no{' '}
        <Link href={'https://www.nav.no/om-hjelpemidler#hvordan'}>
          Informasjon om hjelpemidler og tilrettelegging - nav.no
        </Link>
        .
      </ReadMore>
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
