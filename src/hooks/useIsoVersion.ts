'use client'

import { ISO_VERSION_PARAM, IsoVersion, resolveIsoVersion } from '@/app/kategori/utils/iso-version'

import { useSyncExternalStore } from 'react'

import { useSearchParams } from 'next/navigation'

const subscribe = () => () => {}
const readCookie = () => document.cookie.match(new RegExp(`(?:^|; )${ISO_VERSION_PARAM}=([^;]*)`))?.[1]

export const useIsoVersion = (): IsoVersion => {
  const queryValue = useSearchParams().get(ISO_VERSION_PARAM)
  const cookieValue = useSyncExternalStore(subscribe, readCookie, () => undefined)
  return resolveIsoVersion(queryValue, cookieValue)
}
