"use client"

import {QRCodeCanvas} from "qrcode.react";
import {useEffect, useState} from "react";
import styled from "styled-components";

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
      <QrCodeLink href={qrUrl} download={value + "-qr.png"}>
        Last ned QR-kode
        <div className="product-info__QrCodeHidden">
          <QRCodeCanvas includeMargin={true} value={valueToUrl(value)} id="qr-canvas"/>
        </div>
      </QrCodeLink>
    </>
  )
}


const QrCodeLink = styled.a`
  display: flex;
  width: fit-content;
  margin-top: 1rem;
`
