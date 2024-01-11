import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Søk',
  description: 'Søk etter produkter',
}

export default function SokLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
