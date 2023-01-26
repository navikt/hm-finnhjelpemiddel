import React from 'react'
import { PageWrapper } from '../../animate-page-wrapper'

function Layout({ children }: { children: React.ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>
}

export default Layout
