import { Box, Heading, HStack, VStack } from '@navikt/ds-react'
import styles from './Innganger.module.scss'
import NextLink from 'next/link'

const Innganger = () => {
  return (
    <Box>
      <Heading size={'large'} spacing>
        Hvordan kan vi hjelpe deg?
      </Heading>
      <HStack gap={'6'}>
        <Inngang title={'Jeg jobber med hjelpemidler og tilrettelegging'} />
        <Inngang title={'Jeg er en innbygger og trenger et hjelpemiddel'} />
        <Inngang title={'Alle hjelpemidler'} />
      </HStack>
    </Box>
  )
}

const Inngang = ({ title }: { title: string }) => {
  return (
    <Box as={NextLink} href="/ny" className={styles.inngang} padding={'8'}>
      <VStack gap={'4'}>
        <CircleHeart />
        <Heading level="4" size="small">
          {title}
        </Heading>
      </VStack>
    </Box>
  )
}

const CircleHeart = () => {
  return (
    <svg width="47" height="47" viewBox="0 0 47 47" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="13.9972" cy="28.9262" rx="12.759" ry="12.2074" fill="#CCE2F0" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.5001 9.73037C26.24 7.29733 28.9365 6.11914 31.5782 6.11914C34.5531 6.11914 37.1077 7.6132 39.2262 9.73162C43.8723 14.3777 43.547 22.1754 37.2678 28.4546L24.5399 41.1825L23.5001 40.1452L22.4614 41.1837L9.73237 28.4546C3.45317 22.1754 3.12793 14.3777 7.77403 9.73162C9.89245 7.6132 12.4471 6.11914 15.422 6.11914C18.0637 6.11914 20.7602 7.29733 23.5001 9.73037ZM23.5001 40.1452L22.4614 41.1837C22.7369 41.4591 23.1105 41.6139 23.5001 41.6139C23.8896 41.6139 24.2644 41.4579 24.5399 41.1825L23.5001 40.1452ZM23.5001 38.0681L35.1907 26.3774C40.6615 20.9066 40.3362 14.996 37.149 11.8087C35.3508 10.0105 33.4992 9.05664 31.5782 9.05664C29.6572 9.05664 27.3161 10.0105 24.5387 12.7879C24.2632 13.0634 23.8896 13.2181 23.5001 13.2181C23.1106 13.2181 22.737 13.0634 22.4615 12.7879C19.6841 10.0105 17.343 9.05664 15.422 9.05664C13.501 9.05664 11.6494 10.0105 9.85116 11.8087C6.66395 14.996 6.33868 20.9067 11.8095 26.3774L23.5001 38.0681Z"
        fill="#23262A"
      />
    </svg>
  )
}

export default Innganger
