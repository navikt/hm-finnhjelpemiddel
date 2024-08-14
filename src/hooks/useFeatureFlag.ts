import { IToggle } from '@/toggles/context'
import { EXPECTED_TOGGLES, LOCAL_TOGGLES } from '@/toggles/toggles'
import { fetcherGET } from '@/utils/api-util'
import useSWR from 'swr'

interface IFeatureFlags {
  toggles: IToggle[] | undefined
  isEnabled: (toggle: string) => boolean | undefined
  isLoading: boolean
}

export function useFeatureFlags(): IFeatureFlags {
  const isDevelopment = process.env.NODE_ENV === 'development'

  const queryParams = EXPECTED_TOGGLES.map((toggle) => `feature=${toggle}`).join('&')
  const path = `/adminregister/features?${queryParams}`

  const { data, isLoading } = useSWR<Record<string, boolean>>(isDevelopment ? null : path, fetcherGET, {
    shouldRetryOnError: false,
  })

  if (isDevelopment) {
    return {
      toggles: LOCAL_TOGGLES,
      isEnabled: (toggle: string) => {
        return LOCAL_TOGGLES.find((flag) => flag.name === toggle)?.enabled || false
      },
      isLoading: false,
    }
  }

  const toggles: IToggle[] | undefined = data
    ? EXPECTED_TOGGLES.map((toggle) => ({
        name: toggle,
        enabled: data ? data[toggle] : false,
      }))
    : undefined

  return {
    toggles,
    isEnabled: (toggle: string) => {
      return toggles?.find((flag) => flag.name === toggle)?.enabled
    },
    isLoading,
  }
}
