import { redirect } from 'next/navigation'
import EditAlternativeProductsPage from '@/app/gjenbruksprodukter/rediger/EditAlternativeProductsPage'
import { exchangeToken, getValidUserToken } from '@/app/gjenbruksprodukter/page'

export default async function Page() {
  const userToken = await getValidUserToken()
  const loginUrl = '/oauth2/login?redirect=/gjenbruksprodukter'

  if (process.env.NODE_ENV !== 'development' && !userToken) {
    redirect(loginUrl)
  }

  const oboToken = await exchangeToken(userToken!)

  return <EditAlternativeProductsPage userToken={oboToken!} />
}
