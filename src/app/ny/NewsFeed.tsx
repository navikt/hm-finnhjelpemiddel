import { BodyShort, Box, Heading, HGrid, HStack, VStack } from '@navikt/ds-react'
import styles from './NewsFeed.module.scss'

export const NewsFeed = () => {
  return (
    <VStack gap={'11'}>
      <Heading size={'large'} level={'2'}>
        Siste nytt
      </Heading>
      <HStack gap={'6'}>
        <NewsCard
          title={'NY AVTALE KOMMER'}
          ingress={'Ståstativ og trenings- og aktiviseringshjelpemidler'}
          text={'Avtalen trer i kraft 01.12.2024'}
        />
        <NewsCard
          title={'Tilgjengelighet i Android for hørsel'}
          ingress={'Android har integrert flere tilgjengelighets-funksjoner i operativsystemene til sine produkter.'}
          text={'Les artikkel på Kunnskapsbanken'}
        />
        <NewsCard
          title={'Finn gjenbruksprodukt'}
          ingress={'Vi viser foreløpig hjelpemidler innen disse produktområdene'}
          text={'Se gjenbruksproduktene'}
        />
      </HStack>
    </VStack>
  )
}

const NewsCard = ({ title, ingress, text }: { title: string; ingress: string; text: string }) => {
  return (
    <Box paddingInline={'8'} paddingBlock={'10'} className={styles.newsCard}>
      <VStack gap={'2'} justify={'space-between'}>
        <Heading size={'small'} level={'3'}>
          {title}
        </Heading>
        <BodyShort weight={'semibold'}>{ingress}</BodyShort>
        <BodyShort>{text}</BodyShort>
      </VStack>
    </Box>
  )
}
