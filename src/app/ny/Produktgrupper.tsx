import { Box, Heading, HGrid, HStack } from '@navikt/ds-react'
import styles from './Produktgrupper.module.scss'
import NextLink from 'next/link'

const Produktgrupper = () => {
  return (
    <Box>
      <Heading size={'large'} spacing>
        Hva trenger du hjelp med?
      </Heading>
      <HGrid gap={'6'} columns={{ xs: 1, sm: 2, md: 4 }}>
        <Produktgruppe title={'Hjem og bolig'} />
        <Produktgruppe title={'Sport og aktivitet'} />
        <Produktgruppe title={'Arbeid'} />
        <Produktgruppe title={'Kognisjon'} />
        <Produktgruppe title={'Kommunikasjon'} />
        <Produktgruppe title={'Bevegelse'} />
        <Produktgruppe title={'Posisjonering'} />
        <Produktgruppe title={'Skole og barnehage'} />
        <Produktgruppe title={'Syn'} />
        <Produktgruppe title={'Hørsel'} />
        <Produktgruppe title={'Hygiene'} />
        <Produktgruppe title={'Kombinert sansetap'} />
      </HGrid>
    </Box>
  )
}

const Produktgruppe = ({ title }: { title: string }) => {
  return (
    <Box as={NextLink} href="/ny" className={styles.produktgruppe} paddingBlock={'6'} paddingInline={'4'}>
      <HStack gap={'4'} wrap={false}>
        <CircleFolder />
        <Heading level="4" size="small">
          {title}
        </Heading>
      </HStack>
    </Box>
  )
}

const CircleFolder = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="35" viewBox="0 0 43 35" fill="none">
      <ellipse cx="12.7104" cy="22.8387" rx="12.7104" ry="12.161" fill="#CCE2F0" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.73664 3.48669C6.73664 3.2116 6.95965 2.9886 7.23474 2.9886H19.1891C19.4643 2.9886 19.6872 3.2116 19.6872 3.48669V7.47149C19.6872 8.29676 20.3563 8.96579 21.1815 8.96579H39.6112V27.8936H6.73664V3.48669ZM7.23474 0C5.30909 0 3.74805 1.56104 3.74805 3.48669V28.3917C3.74805 29.7672 4.86307 30.8821 6.23854 30.8821H40.1093C41.4848 30.8821 42.5998 29.7672 42.5998 28.3917V8.46769C42.5998 7.09221 41.4848 5.97719 40.1093 5.97719H22.6758V3.48669C22.6758 1.56104 21.1148 0 19.1891 0H7.23474ZM23.1739 11.9544C23.9992 11.9544 24.6682 12.6234 24.6682 13.4487V16.9354H28.1549C28.9802 16.9354 29.6492 17.6044 29.6492 18.4297C29.6492 19.2549 28.9802 19.924 28.1549 19.924H24.6682V23.4107C24.6682 24.2359 23.9992 24.905 23.1739 24.905C22.3487 24.905 21.6796 24.2359 21.6796 23.4107V19.924H18.1929C17.3677 19.924 16.6986 19.2549 16.6986 18.4297C16.6986 17.6044 17.3677 16.9354 18.1929 16.9354H21.6796V13.4487C21.6796 12.6234 22.3487 11.9544 23.1739 11.9544Z"
        fill="#23262A"
      />
    </svg>
  )
}

export default Produktgrupper
