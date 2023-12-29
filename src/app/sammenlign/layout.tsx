import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sammenligner',
  description: 'Sammenlign produkter',
  icons: [{ rel: 'icon', type: 'image/x-icon', url: 'favicon.ico', sizes: 'any' }],
}

export default function SammenlignLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
