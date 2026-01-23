import { KategoriPage } from './KategoriPage'
import { KategoriOversikt } from '@/app/kategori/KategoriOversikt'
import { getCategoryByTitle } from '@/app/kategori/admin/category-admin-util'

type Props = {
  params: Promise<{ kategori: string }>
}

export default async function Page(props: Props) {
  const kategori = normalizeKategori((await props.params).kategori)

  const category = await getCategoryByTitle(kategori)

  if (category.data.isos?.length) {
    return <KategoriPage category={category} />
  }

  return <KategoriOversikt category={category} />
}

const normalizeKategori = (kategori: string) => {
  return decodeURIComponent(kategori.charAt(0).toUpperCase() + kategori.slice(1))
}
