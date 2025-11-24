import { KategoriPage } from './KategoriPage'
import { KategoriOversikt } from '@/app/kategori/KategoriOversikt'
import { kategorier, KategoriNavn } from '@/utils/kategori-mapping'
import { BodyShort, Link } from '@navikt/ds-react'
import NextLink from 'next/link'

type Props = {
  params: Promise<{ kategori: string }>
}

export default async function Page(props: Props) {
  const kategori = decodeURIComponent((await props.params).kategori) as KategoriNavn

  if (!kategorier[kategori]) {
    return (
      <BodyShort>
        Fant ikke siden &quot;{kategori}&quot;, prøv{' '}
        <Link inlineText as={NextLink} href={`iso/${kategori}`}>
          iso-siden her.
        </Link>
      </BodyShort>
    )
  }

  if (kategorier[kategori].visProdukter) {
    return <KategoriPage kategori={kategori} />
  }

  return <KategoriOversikt kategori={kategori} />
}
