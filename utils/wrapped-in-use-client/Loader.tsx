'use client'
import { Loader } from '@navikt/ds-react'

type LoaderUseClientProps = {
  size?: 'small' | '3xlarge' | '2xlarge' | 'xlarge' | 'large' | 'medium' | 'xsmall' | undefined
  title: string
}

const LoaderUseClient = ({ size, title }: LoaderUseClientProps) => {
  return <Loader className="results__loader" size={size} title={title}></Loader>
}
export default LoaderUseClient
