import AlternativeProductsPage from '@/app/gjenbruksprodukter/AlternativeProductsPage'
import { headers } from 'next/headers'
import { getToken, validateToken } from '@navikt/oasis'
import { redirect } from 'next/navigation'

export default async function Page() {
  const userToken = await getValidUserToken()
  const loginUrl = '/oauth2/login?redirect=/gjenbruksprodukter'

  if (process.env.NODE_ENV !== 'development' && !userToken) {
    redirect(loginUrl)
  }

  return <AlternativeProductsPage userToken={userToken!} />
}
export async function getValidUserToken(): Promise<string | undefined> {
  const token = getToken(await headers())

  if (!token) {
    return undefined
  }

  return (await validateToken(token)).ok ? token : undefined
}
