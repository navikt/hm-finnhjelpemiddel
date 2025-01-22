'use client'

import { DownloadIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { logActionEvent } from '@/utils/amplitude'

export const QrCodeComponent = ({ value, isVariantPage }: { value: string, isVariantPage?: boolean }) => {
  const [qrUrl, setQrUrl] = useState('')

  useEffect(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.font = '2px Arial'
    ctx.fillText(value, 3, 3)

    const qrUrl = canvas.toDataURL('image/png')
    setQrUrl(qrUrl)
  }, [value])

  const valueToUrl = (value: string) => {
    if(isVariantPage) {
      return `https://finnhjelpemiddel.nav.no/produkt/hmsartnr/${value}`

    } else {
      return `https://finnhjelpemiddel.nav.no/produkt/${value}`
    }

  }

  return (
    <Button
      variant="secondary"
      as="a"
      className="product-page__qr-code-link"
      href={qrUrl}
      download={value + '-qr.png'}
      icon={<DownloadIcon aria-hidden fontSize="1.5rem" />}
      onClick={() => logActionEvent('qr-kode')}
    >
      Last ned QR-kode
      <div className="product-page__qr-code-hidden">
        <QRCodeCanvas includeMargin={true} value={valueToUrl(value)} id="qr-canvas" />
      </div>
    </Button>
  )
}
