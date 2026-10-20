'use client'

import { ISO_VERSION_COOKIE, IsoVersion } from '@/app/kategori/utils/iso-version'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { ToggleGroup } from '@navikt/ds-react'

export const IsoVersionSwitch = ({ isoVersion }: { isoVersion: IsoVersion }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const onChange = (value: string) => {
    document.cookie = `${ISO_VERSION_COOKIE}=${value}; path=/; max-age=31536000; SameSite=Lax`
    const params = new URLSearchParams(searchParams.toString())
    params.set('isoVersion', value)
    router.replace(`${pathname}?${params.toString()}`)
    router.refresh()
  }

  return (
    <ToggleGroup label="ISO-versjon" size="small" value={String(isoVersion)} onChange={onChange}>
      <ToggleGroup.Item value="16">ISO 2016</ToggleGroup.Item>
      <ToggleGroup.Item value="22">ISO 2022</ToggleGroup.Item>
    </ToggleGroup>
  )
}
