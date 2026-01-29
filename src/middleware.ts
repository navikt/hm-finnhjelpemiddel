import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken, parseAzureUserToken, requestOboToken, validateToken } from '@navikt/oasis'

const categoryAdminPath = '/kategori/admin'
const categoryAdminBackendPath = '/admin/category'

const gjenbruksprodukterPath = '/gjenbruksprodukter'
const alternativerBackendPath = '/alternative_products'

export const config = {
  matcher: [
    '/alternative_products/:path*',
    '/gjenbruksprodukter/:path*',
    '/kategori/admin/:path*',
    '/admin/category/:path*',
  ],
  runtime: 'nodejs',
}

export async function middleware(request: NextRequest) {
  const isLocal = process.env.NODE_ENV === 'development'
  const runtimeEnv = process.env.RUNTIME_ENVIRONMENT

  const { pathname, origin } = request.nextUrl
  const loginUrl = `${origin}/oauth2/login?redirect=${pathname}`

  if (isLocal) {
    return localDev(pathname, request)
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
    return errorResponse('token validation')
  }

  if (pathname.startsWith(categoryAdminPath) || pathname.startsWith(categoryAdminBackendPath)) {
    const categoryAdminGroupProd = 'a6d5a807-6173-4654-9317-8b196cccef5d'
    const categoryAdminGroupDev = 'da88f4ec-23b3-427b-87c5-e890b7d02519'
    let group = ''
    if (runtimeEnv === 'prod') {
      group = categoryAdminGroupProd
    } else if (runtimeEnv === 'dev') {
      group = categoryAdminGroupDev
    }

    const azureToken = parseAzureUserToken(token)
    if (!azureToken.ok) {
      console.log('azuretoken not ok: ', azureToken.error)
      return errorResponse('azure token not ok')
    } else if (azureToken.ok && azureToken.groups && !azureToken.groups?.includes(group)) {
      console.log('not a member of correct azure group')
      return NextResponse.redirect(`${origin}/tilgang`)
    }
  }

  if (pathname.startsWith(categoryAdminBackendPath) || pathname.startsWith(alternativerBackendPath)) {
    let audience
    let destination = pathname

    if (pathname.startsWith(categoryAdminBackendPath)) {
      destination = process.env.HM_FINNHJELPEMIDDEL_BFF_URL + pathname
      audience = process.env.BFF_AUDIENCE
    }
    if (pathname.startsWith(alternativerBackendPath)) {
      destination = process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + pathname.split(alternativerBackendPath)[1]
      audience = process.env.ALTERNATIVER_BACKEND_AUDIENCE
    }

    if (!audience) {
      console.log('ingen miljøvariabler for backend_audience')
      return errorResponse('no audience')
    }

    const obo = await requestOboToken(token, audience)
    if (!obo.ok) {
      console.log('obo not ok:', obo.error)
      return errorResponse('obo token not ok')
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

const localDev = async (pathname: string, request: NextRequest) => {
  if (pathname.startsWith(categoryAdminPath) || pathname.startsWith(gjenbruksprodukterPath)) {
    return NextResponse.next()
  }

  if (pathname.startsWith(categoryAdminBackendPath) || pathname.startsWith(alternativerBackendPath)) {
    let destination = pathname
    if (pathname.startsWith(categoryAdminBackendPath)) {
      destination = process.env.HM_FINNHJELPEMIDDEL_BFF_URL + pathname
    }
    if (pathname.startsWith(alternativerBackendPath)) {
      destination = process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + pathname.split(alternativerBackendPath)[1]
    }

    const devtoken = process.env.DEV_TOKEN

    return await fetch(new Request(destination, request), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${devtoken}`,
      },
    })
  }
}

const errorResponse = (cause: string) => {
  return NextResponse.json({ success: false, message: `Server error from ${cause}}` }, { status: 500 })
}
