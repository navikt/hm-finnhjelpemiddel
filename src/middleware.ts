import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken, requestOboToken, validateToken } from '@navikt/oasis'

export async function middleware(request: NextRequest) {
  const isLocal = process.env.NODE_ENV === 'development'

  const gjenbruksprodukterPath = '/gjenbruksprodukter'
  const alternativerPath = '/alternative_products'

  const categoryAdminPath = '/kategori/admin'
  const categoryAdminBackendPath = '/admin/category'

  const redirectPath = request.nextUrl.pathname
  const loginUrl = `${request.nextUrl.origin}/oauth2/login?redirect=${redirectPath}`

  if (
    request.nextUrl.pathname.startsWith(gjenbruksprodukterPath) ||
    request.nextUrl.pathname.startsWith(categoryAdminPath)
  ) {
    if (!isLocal && !getToken(request.headers)) {
      return NextResponse.redirect(loginUrl)
    }
  } else if (
    request.nextUrl.pathname.startsWith(alternativerPath) ||
    request.nextUrl.pathname.startsWith(categoryAdminBackendPath)
  ) {
    const devtoken = process.env.DEV_TOKEN

    let destination
    let audience

    if (request.nextUrl.pathname.startsWith(alternativerPath)) {
      destination =
        process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + request.nextUrl.pathname.split(alternativerPath)[1]
      audience = process.env.ALTERNATIVER_BACKEND_AUDIENCE
    } else {
      destination = process.env.HM_FINNHJELPEMIDDEL_BFF_URL + request.nextUrl.pathname
      audience = process.env.BFF_AUDIENCE
    }

    if (isLocal) {
      return await fetch(new Request(destination, request), {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${devtoken}`,
        },
      })
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

    return await fetch(new Request(destination, request), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${obo.token}`,
      },
    })
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/alternative_products/:path*',
    '/gjenbruksprodukter/:path*',
    '/kategori/admin/:path*',
    '/admin/category/:path*',
  ],
  runtime: 'nodejs',
}
