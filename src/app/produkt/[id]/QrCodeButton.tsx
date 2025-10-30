'use client'

import { Button, Heading } from '@navikt/ds-react'
import { QRCodeCanvas } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { logActionEvent } from '@/utils/amplitude'
import { usePathname } from 'next/navigation'
import { QrCodeIcon } from '@navikt/aksel-icons'

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
    <>
    <Button
      size="medium"
      style={{ alignSelf: 'end', border: '1px dashed #0056b4'}}
      variant={'tertiary'}
      as="a"
      href={qrUrl}
      download={id + '-qr.png'}
      onClick={() => logActionEvent('qr-kode')}
    >
      Last ned QR-kode
      <div style={{ display: 'none' }}>
        <QRCodeCanvas includeMargin={true} value={url} id="qr-canvas" />
      </div>
    </Button>
    </>
  )
}
