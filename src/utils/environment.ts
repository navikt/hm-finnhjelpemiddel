import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export function isProd() {
    return publicRuntimeConfig.env === 'prod'
}

