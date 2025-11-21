import { fetchIsoTree } from '@/utils/iso-util'
import { IsoKategoriPage } from '@/app/kategori/iso/[iso]/IsoKategoriPage'

type Props = {
  params: Promise<{ iso: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const isos = await fetchIsoTree()

  return <IsoKategoriPage iso={params.iso} isoTree={isos} />
}
