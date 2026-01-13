import { EditCategory } from '@/app/kategori/admin/[id]/EditCategory'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const kategori = (await props.params).id

  return <EditCategory id={kategori} />
}
