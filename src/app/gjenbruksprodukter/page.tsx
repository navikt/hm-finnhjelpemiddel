import AlternativeProductsPage from '@/app/gjenbruksprodukter/AlternativeProductsPage'
import { headers } from 'next/headers'
import { getToken, validateToken } from '@navikt/oasis'
import { redirect } from 'next/navigation'

export default async function Page() {
  const auth = await isUserLoggedIn()
  const loginUrl = '/oauth2/login?redirect=/gjenbruksprodukter'

  if (process.env.NODE_ENV !== 'development' && !auth) {
    redirect(loginUrl)
  }

  return <AlternativeProductsPage />
}
async function isUserLoggedIn(): Promise<boolean> {
  const requestHeaders = await headers()
  const token = getToken(requestHeaders)

  if (!token) {
    return false
  }
  const validationResult = await validateToken(token)
  return validationResult.ok
}
