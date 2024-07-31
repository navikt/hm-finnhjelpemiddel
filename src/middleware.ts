import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware is run on every document request
 */
export default async function middleware(req: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(req.headers)

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
