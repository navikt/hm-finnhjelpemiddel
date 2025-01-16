'use client'
import * as amplitude from '@amplitude/analytics-browser'
import { track } from '@amplitude/analytics-browser'

const APP_NAME = 'hm-oversikt-frontend'
const TEAM_NAME = 'teamdigihot'
const AMP_COLLECTION_URL = 'https://amplitude.nav.no/collect-auto'
const AMP_PUBLIC_KEY_PROD = '10798841ebeba333b8ece6c046322d76'
const AMP_PUBLIC_KEY_DEV = 'c1c2553d689ba4716c7d7c4410b521f5'

type LogEvent = (params: { name: string; data?: any }) => void

let amplitudeLogger: LogEvent | undefined = undefined

export enum digihot_customevents {
  VISNING_OVERSIKT = 'visning av sider fra hm-oversikt-app',
  LEVERANDORPRODUKTER_KLIKKET_V2 = 'klikket på vis leverandørprodukter',
  NAVIGERE = 'navigere',
  KLIKK = 'klikk på knapp',
  ERROR_URL = 'feil ved url',
  VARIANTSIDE_VIST = 'visning av stor variantside',
  PEPPERKAKE = 'klikk på pepperkake',
}

export enum nav_events {
  BESØK = 'besøk',
}

export const initAmplitude = () => {
  const apiKey =
    process.env.BUILD_ENV === 'prod'
      ? AMP_PUBLIC_KEY_PROD
      : process.env.BUILD_ENV === 'dev'
        ? AMP_PUBLIC_KEY_DEV
        : 'mock'
  if (apiKey === 'mock') {
    amplitudeLogger = (params: { name: string; data?: any }) => {
      console.log('[Mock Amplitude Event]', {
        name: params.name,
        data: {
          ...('data' in params.data ? params.data.data : {}),
          ...params.data,
        },
      })
    }
  } else {
    amplitude.init(apiKey!, {
      serverUrl: AMP_COLLECTION_URL,
      serverZone: 'EU',
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
      },
    })
    amplitudeLogger = (params: { name: string; data?: any }) => {
      amplitude.logEvent(params.name, params.data)
    }
  }
}

export function logAmplitudeEvent(eventName: string, data?: any) {
  setTimeout(() => {
    data = {
      app: APP_NAME,
      team: TEAM_NAME,
      ...data,
    }
    try {
      if (amplitude) {
        track(eventName, data)
      }
    } catch (error) {
      console.error(error)
    }
  })
}

export function logCustomEvent(event: digihot_customevents, data?: any) {
  logAmplitudeEvent(event, {
    TEAM_NAME: TEAM_NAME,
    ...data,
  })
}

export function logOversiktForsideVist() {
  logCustomEvent(digihot_customevents.VISNING_OVERSIKT)
}

export function logNavigationEvent(komponent: string, destinasjon: string, lenketekst: string) {
  logCustomEvent(digihot_customevents.NAVIGERE, {
    komponent: komponent,
    destinasjon: destinasjon,
    lenketekst: lenketekst,
  })
}

export function logLeverandorprodukterKlikket() {
  logCustomEvent(digihot_customevents.LEVERANDORPRODUKTER_KLIKKET_V2)
}

export function logVariantSideVist() {
  logCustomEvent(digihot_customevents.VARIANTSIDE_VIST)
}

export function logKlikk(buttonName: string) {
  logCustomEvent(digihot_customevents.KLIKK, {
    buttonName: buttonName,
  })
}

export function logErrorOnUrl(url: string) {
  logCustomEvent(digihot_customevents.ERROR_URL, {
    url: url,
  })
}

export function logVisit(url: string, sidetittel: string) {
  logAmplitudeEvent(nav_events.BESØK, {
    url: url,
    sidetittel: sidetittel,
  })
}
