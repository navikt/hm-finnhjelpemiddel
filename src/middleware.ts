import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const newUrl = request.nextUrl.pathname.split('/alternative_products')[1]

  return NextResponse.rewrite(new URL(newUrl, process.env.HM_GRUNNDATA_ALTERNATIVPRODUKTER_URL))
}

// kjør bare på alternativ-ingressen
export const config = {
  matcher: '/alternative_products/:path*',
}
