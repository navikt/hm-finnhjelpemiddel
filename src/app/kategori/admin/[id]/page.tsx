import { EditCategoryPage } from '@/app/kategori/admin/[id]/EditCategoryPage'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const category = (await props.params).id

  return <EditCategoryPage id={category} />
}
