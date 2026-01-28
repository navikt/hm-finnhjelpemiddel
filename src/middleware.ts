import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getToken, parseAzureUserToken, requestOboToken, validateToken } from '@navikt/oasis'

const categoryAdminPath = '/kategori/admin'
const categoryAdminBackendPath = '/admin/category'

const gjenbruksprodukterPath = '/gjenbruksprodukter'
const alternativerBackendPath = '/alternative_products'

const isLocal = process.env.NODE_ENV === 'development'
const runtimeEnv = process.env.RUNTIME_ENVIRONMENT

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  const loginUrl = `${origin}/oauth2/login?redirect=${pathname}`
  console.log('nexturl', request.nextUrl)
  if (pathname.startsWith(gjenbruksprodukterPath) || pathname.startsWith(categoryAdminPath)) {
    if (!isLocal && !getToken(request.headers)) {
      return NextResponse.redirect(loginUrl)
    }
  } else if (pathname.startsWith(alternativerBackendPath)) {
    return alternativerAdmin(request, loginUrl)
  } else if (pathname.startsWith(categoryAdminBackendPath)) {
    return categoryAdmin(request, loginUrl)
  }
  return NextResponse.next()
}

const alternativerAdmin = async (request: NextRequest, loginUrl: string) => {
  const destination =
    process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL + request.nextUrl.pathname.split(alternativerBackendPath)[1]
  const audience = process.env.ALTERNATIVER_BACKEND_AUDIENCE

  if (isLocal) {
    const devtoken = process.env.DEV_TOKEN

    return await fetch(new Request(destination, request), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${devtoken}`,
      },
    })
  }

  return tokenFlow(request, audience, destination, loginUrl)
}
const categoryAdmin = async (request: NextRequest, loginUrl: string) => {
  const destination = process.env.HM_FINNHJELPEMIDDEL_BFF_URL + request.nextUrl.pathname
  const audience = process.env.BFF_AUDIENCE

  const categoryAdminGroupProd = 'a6d5a807-6173-4654-9317-8b196cccef5d'
  const categoryAdminGroupDev = 'da88f4ec-23b3-427b-87c5-e890b7d02519'
  let group
  if (runtimeEnv === 'prod') {
    group = categoryAdminGroupProd
  } else if (runtimeEnv === 'dev') {
    group = categoryAdminGroupDev
  }

  if (isLocal) {
    const devtoken = process.env.DEV_TOKEN

    return await fetch(new Request(destination, request), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${devtoken}`,
      },
    })
  }

  return tokenFlow(request, audience, destination, loginUrl, group)
}

const tokenFlow = async (
  request: NextRequest,
  audience: string | undefined,
  destination: string,
  loginUrl: string,
  group?: string | undefined
) => {
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

  if (group) {
    const azureToken = parseAzureUserToken(token)
    console.log('group:', group)
    if (!azureToken.ok) {
      console.log('azuretoken not ok: ', azureToken.error)
      return NextResponse.next()
    } else if (azureToken.ok && azureToken.groups && !azureToken.groups?.includes(group)) {
      console.log('not a member of correct azure group')
      return NextResponse.next()
    }
    console.log('azgroups:', azureToken.groups)
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

export const config = {
  matcher: [
    '/alternative_products/:path*',
    '/gjenbruksprodukter/:path*',
    '/kategori/admin/:path*',
    '/admin/category/:path*',
  ],
  runtime: 'nodejs',
}
