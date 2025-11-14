import { KategoriPage } from '@/app/kategori/[iso]/KategoriPage'

type Props = {
  params: Promise<{ iso: string }>
}

export default async function Page(props: Props) {
  const params = await props.params

  return <KategoriPage />
}
