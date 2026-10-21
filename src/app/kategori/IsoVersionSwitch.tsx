'use client'

import { ISO_VERSION_PARAM } from '@/app/kategori/utils/iso-version'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { BodyShort, ToggleGroup, VStack } from '@navikt/ds-react'

import { useIsoVersion } from '@/hooks/useIsoVersion'

export const IsoVersionSwitch = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isoVersion = useIsoVersion()

  const onChange = (value: string) => {
    document.cookie = `${ISO_VERSION_PARAM}=${value}; path=/; max-age=31536000; SameSite=Lax`
    const params = new URLSearchParams(searchParams.toString())
    params.set(ISO_VERSION_PARAM, value)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <VStack gap={'space-4'}>
      <ToggleGroup label="ISO-versjon" size="small" value={String(isoVersion)} onChange={onChange}>
        <ToggleGroup.Item value="16">ISO 2016</ToggleGroup.Item>
        <ToggleGroup.Item value="22">ISO 2022</ToggleGroup.Item>
      </ToggleGroup>
      <BodyShort size="small" textColor="subtle">
        Gjelder kategorisidene i denne nettleseren. Brukes til å forhåndsvise ISO 2022.
      </BodyShort>
    </VStack>
  )
}
