import AlternativeProductsPage from '@/app/gjenbruksprodukter/AlternativeProductsPage'
import { headers } from 'next/headers'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { redirect } from 'next/navigation'

export default async function Page() {
  const userToken = await getValidUserToken()
  const loginUrl = '/oauth2/login?redirect=/gjenbruksprodukter'

  if (process.env.NODE_ENV === 'development' || userToken) {
    const oboToken = await exchangeToken(userToken!)

    return <AlternativeProductsPage userToken={oboToken!} />
  }

  if (process.env.NODE_ENV === 'production' && !userToken) {
    redirect(loginUrl)
  }
}
export async function getValidUserToken(): Promise<string | undefined> {
  const token = getToken(await headers())

  if (!token) {
    console.log('ingen token header')
    return undefined
  }

  const validToken = await validateToken(token)
  return validToken.ok ? token : validToken.error.message
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
