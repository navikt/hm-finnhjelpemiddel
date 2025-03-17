import '../../parts-page.scss'
import { BodyShort, Heading, HStack, Link, VStack } from '@navikt/ds-react'
import { PartsList } from "@/app/produkt/[id]/deler/PartsList";
import NextLink from "next/link";

type Props = {
  params: Promise<{ id: string }>
}

export default async function PartsPage(props: Props) {
  const params = await props.params
  return (
    <div className="main-wrapper--large parts-page spacing-top--large spacing-bottom--large">
      <VStack gap="4">
        <HStack gap="3">
          <Link as={NextLink} href={`/produkt/${params.id}`} variant="subtle">
            {`Tilbake`}
          </Link>
          <BodyShort textColor="subtle">/</BodyShort>
        </HStack>
      <Heading level="1" size="medium" >
        Tilbehør og reservedeler
      </Heading>
      <div>
        {params.id && (
          <PartsList seriesId={params.id} />
        )}

      </div>
      </VStack>
    </div>
  )
}
