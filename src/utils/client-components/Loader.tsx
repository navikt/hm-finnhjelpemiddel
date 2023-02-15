'use client'
import { Loader } from '@navikt/ds-react'

type ClientLoaderProps = {
  size?: 'small' | '3xlarge' | '2xlarge' | 'xlarge' | 'large' | 'medium' | 'xsmall' | undefined
  title: string
}

const ClientLoader = ({ size, title }: ClientLoaderProps) => {
  return <Loader className="results__loader" size={size} title={title}></Loader>
}
export default ClientLoader
