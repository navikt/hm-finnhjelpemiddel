'use client'

import { Button } from '@navikt/ds-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { logActionEvent } from '@/utils/amplitude'
import { usePathname } from 'next/navigation'

export const QrCodeButton = ({ id }: { id: string }) => {
  const [qrUrl, setQrUrl] = useState('')
  const pathname = usePathname()
  const url = `https://finnhjelpemiddel.nav.no${pathname}`

  useEffect(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    ctx.font = '2px Arial'
    ctx.fillText(id, 3, 3)

    const qrUrl = canvas.toDataURL('image/png')
    setQrUrl(qrUrl)
  }, [id])

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
        <QRCodeCanvas includeMargin={true} value={url} id="qr-canvas" />
      </div>
    </Button>
  )
}
