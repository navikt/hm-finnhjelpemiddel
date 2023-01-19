import React from 'react'
import { PageWrapper } from '../page-wrapper'
import './compare.scss'

function Layout({ children }: { children: React.ReactNode }) {
  return <PageWrapper>{children}</PageWrapper>
}

export default Layout
