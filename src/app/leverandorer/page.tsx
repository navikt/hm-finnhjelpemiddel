'use client'

import SupplierList from '@/app/leverandorer/SupplierList'
import { getAllSuppliers } from '@/utils/api-util'
import { alphabet, Supplier } from '@/utils/supplier-util'
import { ArrowUpIcon } from '@navikt/aksel-icons'
import { Button, Heading, HStack, Link, Loader } from '@navikt/ds-react'
import NextLink from 'next/link'
import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWR from 'swr'

const disabledLetters = ['Z', 'Æ', 'Å']

export default function SearchPage() {
  const { data: activeSuppliers, isLoading } = useSWR<Supplier[]>('/suppliers/_search', getAllSuppliers, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  })

  const { ref: pageTopRef, inView: isAtPageTop } = useInView({ threshold: 0.9 })
  const headingRef = useRef<HTMLHeadingElement>(null)
  const setFocusOnHeading = () => {
    headingRef.current && headingRef.current.scrollIntoView()
  }

  return (
    <div className="suppliers-page">
      <div className="suppliers-page__content  main-wrapper--medium">
        <article>
          <div className="flex flex--space-between" ref={headingRef}>
            <Heading level="1" size="large" className="spacing-bottom--small" ref={pageTopRef}>
              Leverandører
            </Heading>
          </div>
          <div className="spacing-bottom--small">
            {`Nedenfor finner du en liste av leverandører med produkter på finnhjelpemiddel.no`}
          </div>

          {!isLoading && activeSuppliers && (
            <>
              <HStack gap="2" className="spacing-bottom--large">
                {alphabet.map((letter) => (
                  <span
                    className={
                      disabledLetters.includes(letter) ? 'suppliers-page__letter-disabled' : 'suppliers-page__letter'
                    }
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
        </article>
      </div>
      {!isAtPageTop && (
        <Button
          type="button"
          className="search__page-up-button"
          icon={<ArrowUpIcon title="Gå til toppen av siden" />}
          onClick={() => setFocusOnHeading()}
        />
      )}
    </div>
  )
}
