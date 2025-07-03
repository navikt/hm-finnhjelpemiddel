import { Faro, getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'

let faro: Faro | null = null
export function initInstrumentation(): void {
  if (typeof window === 'undefined' || faro !== null) return

  getFaro()
}

export function getFaro(): Faro | null {
  if (process.env.NEXT_PUBLIC_FARO_URL == null) return null

  if (faro != null) return faro
  faro = initializeFaro({
    paused: process.env.NODE_ENV !== 'production',
    url: process.env.NEXT_PUBLIC_FARO_URL,
    app: {
      name: 'hm-finnhjelpemiddel',
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: false,
      }),
      // new TracingInstrumentation(),
    ],
  })
  return faro
}
