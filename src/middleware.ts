import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'

export async function middleware(request: NextRequest) {
  const isLocal = process.env.NODE_ENV === 'development'

  const gjenbruksprodukterPath = '/gjenbruksprodukter'
  const alternativerPath = '/alternative_products'

  const redirectPath = request.nextUrl.pathname
  const loginUrl = `${request.nextUrl.origin}/oauth2/login?redirect=${redirectPath}`

  if (request.nextUrl.pathname.startsWith(gjenbruksprodukterPath)) {
    if (!isLocal && !getToken(request.headers)) {
      return NextResponse.redirect(loginUrl)
    }
  } else if (request.nextUrl.pathname.startsWith(alternativerPath)) {
    const devtoken = process.env.DEV_TOKEN
    const destination =
      process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + request.nextUrl.pathname.split(alternativerPath)[1]
    const audience = process.env.ALTERNATIVER_BACKEND_AUDIENCE
    const response = NextResponse.rewrite(destination)

    if (isLocal) {
      response.headers.set('Authorization', `Bearer ${devtoken}`)
      return response
    }

    if (!audience) {
      console.log('ingen miljøvariabler for backend_audience')
      return NextResponse.next()
    }

    const token = getToken(request.headers)
    if (!token) {
      return NextResponse.redirect(loginUrl)
    }

    const validationResult = await validateToken(token)
    if (!validationResult.ok && validationResult.errorType === 'token expired') {
      return NextResponse.redirect(loginUrl)
    } else if (!validationResult.ok) {
      console.log('validation not ok:', validationResult.error)
      return NextResponse.next()
    }

    const obo = await requestOboToken(token, audience)
    if (!obo.ok) {
      console.log('obo not ok:', obo.error)
      return NextResponse.next()
    }

    response.headers.set('Authorization', `Bearer ${obo.token}`)
    return response
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/alternative_products/:path*', '/gjenbruksprodukter/:path*'],
  runtime: 'nodejs',
}
