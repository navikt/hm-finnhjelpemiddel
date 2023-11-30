"use client"

import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";

export const QrCodeComponent = ({value}: { value: string }) => {

  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    ctx.font = "2px Arial";
    ctx.fillText(value, 3, 3);

    const qrUrl = canvas.toDataURL("image/png")
    setQrUrl(qrUrl);
  }, [value],);

  const valueToUrl = (value: string) => {
    return `https://finnhjelpemiddel.nav.no/produkt/${value}`;
  };

  return (
    <>
      <a className="product-info__qr-code-link" href={qrUrl} download={value + "-qr.png"}>
        Last ned QR-kode
        <div className="product-info__qr-code-hidden">
          <QRCodeCanvas includeMargin={true} value={valueToUrl(value)} id="qr-canvas" />
        </div>
      </a>
    </>
  )
}

