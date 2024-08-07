import { IToggle } from '@/toggles/context'
import { EXPECTED_TOGGLES, LOCAL_TOGGLES } from '@/toggles/toggles'
import { fetcherGET } from '@/utils/api-util'
import useSWR from 'swr'

interface IFeatureFlags {
  toggles: IToggle[]
  isEnabled: (toggle: string) => boolean
}

export function useFeatureFlags(): IFeatureFlags {
  const useLocalToggles = process.env.NODE_ENV === 'development'
  const queryParams = EXPECTED_TOGGLES.map((toggle) => `feature=${toggle}`).join('&')
  const path = `/adminregister/features?${queryParams}`

  if (process.env.NODE_ENV === 'development') {
    return {
      toggles: LOCAL_TOGGLES,
      isEnabled: (toggle: string) => {
        return LOCAL_TOGGLES.find((flag) => flag.name === toggle)?.enabled || false
      },
    }
  }

  const { data, error } = useSWR<Record<string, boolean>>(!useLocalToggles ? path : null, fetcherGET)

  if (error) {
    return {
      toggles: [],
      isEnabled: () => false,
    }
  }

  const toggles: IToggle[] = EXPECTED_TOGGLES.map((toggle) => ({
    name: toggle,
    enabled: data ? data[toggle] : false,
  }))

  return {
    toggles,
    isEnabled: (toggle: string) => {
      return toggles.find((flag) => flag.name === toggle)?.enabled || false
    },
  }
}
