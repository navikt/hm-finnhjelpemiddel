import { KategoriPage } from '@/app/kategori/[iso]/KategoriPage'
import { fetchIsoTree } from '@/utils/iso-util'

type Props = {
  params: Promise<{ iso: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const isoTree = await fetchIsoTree()

  return <KategoriPage iso={params.iso} isoTree={isoTree} />
}
