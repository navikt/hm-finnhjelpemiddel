import AlternativeProductsPage from '@/app/gjenbruksprodukter/AlternativeProductsPage'
import { headers } from 'next/headers'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { redirect } from 'next/navigation'

export default async function Page() {
  const userToken = await getValidUserToken()
  const loginUrl = '/oauth2/login?redirect=/gjenbruksprodukter'

  if (process.env.NODE_ENV !== 'development' && !userToken) {
    redirect(loginUrl)
  }

  const oboToken = await exchangeToken(userToken!)

  return <AlternativeProductsPage userToken={oboToken!} />
}
export async function getValidUserToken(): Promise<string | undefined> {
  const token = getToken(await headers())

  if (!token) {
    return undefined
  }

  return (await validateToken(token)).ok ? token : undefined
}

export async function exchangeToken(token: string): Promise<string | undefined> {
  const audience = process.env.NEXT_PUBLIC_ALTERNATIVER_BACKEND_AUDIENCE

  if (!audience) {
    console.log('ingen miljøvariabler')
    return undefined
  }

  const obo = await requestOboToken(token, audience)

  return obo.ok ? obo.token : obo.error.message
}
