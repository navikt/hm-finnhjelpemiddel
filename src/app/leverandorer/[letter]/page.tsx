import { Heading } from '@/components/aksel-client'
import AnimateLayout from '@/components/layout/AnimateLayout'
import { Metadata } from 'next'
import SupplierList from "@/app/leverandorer/[letter]/SupplierList";
import { getSuppliers } from "@/utils/api-util";
import { HStack, Link, Loader } from "@navikt/ds-react";
import { alphabet } from "@/utils/supplier-util";
import NextLink from "next/link";

export const metadata: Metadata = {
    title: 'Leverandører',
    description: 'Oversikt over leverandører',
}

type Props = {
    params: { letter: string }
}

export default async function LeverandorerInfoPage({ params }: Props) {

    const suppliers = await getSuppliers(params.letter ?? 'A')


    return (
        <div className="suppliers-page">
            <AnimateLayout>
                <div className="suppliers-page__content  main-wrapper--medium">
                    <article>
                        <div className="flex flex--space-between">
                            <Heading level="1" size="large" className="spacing-bottom--small">
                                Leverandører
                            </Heading>
                        </div>
                        <div className="spacing-bottom--small">
                            {`Nedenfor finner du en liste av leverandører med produkter på finnhjelpemiddel.no`}
                        </div>
                        <HStack gap="2">
                            {alphabet.map(
                                (letter) => (
                                    <span className="suppliers-page__letter" key={letter}>
                                        <Link as={NextLink}
                                              href={`/leverandorer/${letter}`}
                                              key={letter}>{letter}</Link>
                                    </span>
                                )
                            )}
                        </HStack>
                        <SupplierList params={{ letter: params.letter }} suppliers={suppliers} />

                        {!suppliers && (
                            <HStack justify="center" style={{ marginTop: '18px' }}>
                                <Loader size="xlarge" title="Laster produkter" />
                            </HStack>
                        )}
                    </article>
                </div>
            </AnimateLayout>
        </div>
    )
}
