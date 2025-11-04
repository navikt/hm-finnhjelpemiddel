import EditAlternativeProductsPage from '@/app/gjenbruksprodukter/rediger/EditAlternativeProductsPage'
import { tokenFix } from '@/app/gjenbruksprodukter/page'

export default async function Page() {
  const oboToken = await tokenFix('/gjenbruksprodukter')

  if (!oboToken) {
    return <>En feil har skjedd med innlogging.</>
  }

  return <EditAlternativeProductsPage userToken={oboToken!} />
}
