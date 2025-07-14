'use client'

import SupplierList from '@/app/leverandorer/SupplierList'
import { getAllSuppliers } from '@/utils/api-util'
import { alphabet, Supplier } from '@/utils/supplier-util'
import { BodyShort, Box, Heading, HStack, Link, Loader, VStack } from '@navikt/ds-react'
import NextLink from 'next/link'
import useSWR from 'swr'
import styles from './SupplierPage.module.scss'

const disabledLetters = ['Z', 'Æ', 'Å']

export default function SearchPage() {
  const { data: activeSuppliers, isLoading } = useSWR<Supplier[]>('/suppliers/_search', getAllSuppliers, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  return (
    <div className={styles.suppliersPage}>
      <Box
        marginInline={'auto'}
        marginBlock={'0'}
        maxWidth={'1000px'}
        paddingBlock={'0 12'}
        paddingInline={{ xs: '4', md: '12' }}
      >
        <VStack
          className={styles.pageContent}
          gap={'4'}
          paddingBlock={{ xs: '6', md: '12' }}
          paddingInline={{ xs: '4', md: '12' }}
        >
          <div>
            <Heading level="1" size="large" spacing>
              Leverandører
            </Heading>
          </div>
          <BodyShort spacing>
            Nedenfor finner du en liste av leverandører med produkter på finnhjelpemiddel.no
          </BodyShort>

          {!isLoading && activeSuppliers && (
            <>
              <HStack gap="2" paddingBlock={{ xs: '0 8', md: '0 12' }}>
                {alphabet.map((letter) => (
                  <span
                    className={disabledLetters.includes(letter) ? styles.letterDisabled : styles.letter}
                    aria-hidden={disabledLetters.includes(letter) ? 'true' : 'false'}
                    key={letter}
                  >
                    <Link as={NextLink} href={`#${letter}`} key={letter}>
                      {letter}
                    </Link>
                  </span>
                ))}
              </HStack>

              {alphabet.map((letter) => (
                <SupplierList
                  key={letter}
                  letter={letter}
                  suppliers={activeSuppliers.filter((value) => value.name.at(0)?.toUpperCase() === letter)}
                />
              ))}
            </>
          )}

          {isLoading && (
            <HStack justify="center" style={{ marginTop: '18px' }}>
              <Loader size="xlarge" title="Laster leverandører" />
            </HStack>
          )}
        </VStack>
      </Box>
    </div>
  )
}
