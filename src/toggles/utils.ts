import { IToggle } from '@unleash/nextjs'

import { EXPECTED_TOGGLES } from './toggles'
import * as process from 'process'

export function localDevelopmentToggles(): IToggle[] {
  return EXPECTED_TOGGLES.map(
    (it): IToggle => ({
      name: it,
      enabled: false,
      impressionData: false,
      variant: {
        name: 'disabled',
        enabled: false,
      },
    })
  )
}

export function getUnleashEnvironment(): 'development' | 'production' {
  switch (process.env.RUNTIME_ENVIRONMENT) {
    case 'dev':
      return 'development'
    case 'prod':
      return 'production'
    default:
      return 'production'
  }
}
