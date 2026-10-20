import { AdminPage } from '@/app/kategori/admin/AdminPage'
import { ISO_VERSION_COOKIE, resolveIsoVersion } from '@/app/kategori/utils/iso-version'

import { cookies } from 'next/headers'

type Props = {
  searchParams: Promise<{ [key: string]: string[] | string | undefined }>
}

export default async function Page(props: Props) {
  const isoVersion = resolveIsoVersion(await props.searchParams, (await cookies()).get(ISO_VERSION_COOKIE)?.value)
  return <AdminPage isoVersion={isoVersion} />
}
