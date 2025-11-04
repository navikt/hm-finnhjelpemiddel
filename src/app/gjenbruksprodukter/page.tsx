import AlternativeProductsPage from '@/app/gjenbruksprodukter/AlternativeProductsPage'
import { headers } from 'next/headers'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'
import { redirect } from 'next/navigation'

export default async function Page() {
  const oboToken = await tokenFix('/gjenbruksprodukter')

  if (!oboToken) {
    return <>En feil har skjedd med innlogging.</>
  }

  return <AlternativeProductsPage userToken={oboToken} />
}

function loginUser(redirectPath: string) {
  redirect(`/oauth2/login?redirect=${redirectPath}`)
}
export async function tokenFix(redirectPath: string): Promise<string | undefined> {
  const audience = process.env.NEXT_PUBLIC_ALTERNATIVER_BACKEND_AUDIENCE

  if (!audience) {
    console.log('ingen miljøvariabler for backend_audience')
    return undefined
  }

  const token = getToken(await headers())

  if (!token) {
    loginUser(redirectPath)
  }

  const validationResult = await validateToken(token!)

  if (validationResult.ok) {
    return token!
    /*
    const obo = await requestOboToken(token!, audience)

    if (obo.ok) {
      return obo.token
    } else {
      console.log('Feil med obo-token')
      return undefined
    }
    
     */
  } else if (!validationResult.ok && validationResult.errorType === 'token expired') {
    loginUser(redirectPath)
  } else {
    console.log('Feil med tokenvalidering: ', validationResult.error)
    return undefined
  }
}
