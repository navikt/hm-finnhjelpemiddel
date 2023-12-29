import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Søk',
  description: 'Søk etter produkter',
  icons: [{ rel: 'icon', type: 'image/x-icon', url: 'favicon.ico', sizes: 'any' }],
}

export default function SokLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
