'use client'

import { DownloadIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { logActionEvent } from '@/utils/amplitude'

export const QrCodeButton = ({ id, isVariantPage }: { id: string; isVariantPage?: boolean }) => {
  const [qrUrl, setQrUrl] = useState('')

  useEffect(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.font = '2px Arial'
    ctx.fillText(id, 3, 3)

    const qrUrl = canvas.toDataURL('image/png')
    setQrUrl(qrUrl)
  }, [id])

  const valueToUrl = (value: string) => {
    if (isVariantPage) {
      return `https://finnhjelpemiddel.nav.no/produkt/hmsartnr/${value}`
    } else {
      return `https://finnhjelpemiddel.nav.no/produkt/${value}`
    }
  }

  return (
    <Button
      variant="secondary"
      as="a"
      style={{ alignSelf: 'start' }}
      href={qrUrl}
      download={id + '-qr.png'}
      onClick={() => logActionEvent('qr-kode')}
    >
      Last ned QR-kode
      <div style={{ display: 'none' }}>
        <QRCodeCanvas includeMargin={true} value={valueToUrl(id)} id="qr-canvas" />
      </div>
    </Button>
  )
}
