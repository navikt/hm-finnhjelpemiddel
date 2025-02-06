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
  LEVERANDORPRODUKTER_KLIKKET_V2 = 'klikket på vis leverandørprodukter',
  NAVIGERE = 'navigere',
  ACTION = 'action',
  KLIKK = 'klikk på knapp',
  ERROR_URL = 'feil ved url',
  VARIANTSIDE_VIST = 'visning av stor variantside',
  PEPPERKAKE = 'klikk på pepperkake',
  VIS_FLERE_TREFF = 'vis-flere-treff',
  FILTRERING = 'filtrering',
  FILTER_ENDRET = 'filter-endret',
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
        pageViews: false,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
      },
      cookieOptions: {
        sameSite: 'Strict',
        domain: process.env.BUILD_ENV === 'prod' ? 'finnhjelpemiddel.nav.no' : 'finnhjelpemiddel.intern.dev.nav.no',
      },
    })
    amplitudeLogger = (params: { name: string; data?: any }) => {
      amplitude.logEvent(params.name, params.data)
    }
  }
}

export const stopAmplitude = () => {
  amplitude.reset()
  amplitude.flush()
  amplitude.setOptOut(true)
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
    ...data,
  })
}

export function logNavigationEvent(komponent: string, destinasjon: string, lenketekst: string) {
  logCustomEvent(digihot_customevents.NAVIGERE, {
    komponent: komponent,
    destinasjon: destinasjon,
    lenketekst: lenketekst,
  })
}

export function logNavigationSearchEvent(
  komponent: string,
  destinasjon: string,
  lenketekst: string,
  søkeresultatplassering: number
) {
  logCustomEvent(digihot_customevents.NAVIGERE, {
    komponent: komponent,
    destinasjon: destinasjon,
    lenketekst: lenketekst,
    søkeresultatplassering: søkeresultatplassering,
  })
}

export function logActionEvent(handling: string) {
  logCustomEvent(digihot_customevents.ACTION, {
    handling: handling,
  })
}

export function logFilterEvent(filter: Record<string, string | string[]>, komponent: string) {
  logCustomEvent(digihot_customevents.FILTRERING, {
    filter: filter,
    komponent: komponent,
  })
}

export function logFilterEndretEvent(komponent: string) {
  logCustomEvent(digihot_customevents.FILTER_ENDRET, {
    komponent: komponent,
  })
}

export function logVisFlereTreff() {
  logCustomEvent(digihot_customevents.VIS_FLERE_TREFF)
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

export function logVisit(url: string, sidetittel: string, sidetype: string) {
  logAmplitudeEvent(nav_events.BESØK, {
    url: url,
    sidetittel: sidetittel,
    sidetype: sidetype,
  })
}
