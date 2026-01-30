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
        marginBlock={"space-0"}
        maxWidth={'1000px'}
        paddingBlock={"space-0 space-48"}
        paddingInline={{ xs: "space-16", md: "space-48" }}
      >
        <VStack
          className={styles.pageContent}
          gap={"space-16"}
          paddingBlock={{ xs: "space-24", md: "space-48" }}
          paddingInline={{ xs: "space-16", md: "space-48" }}
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
              <HStack gap="space-8" paddingBlock={{ xs: "space-0 space-32", md: "space-0 space-48" }}>
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
  );
}
