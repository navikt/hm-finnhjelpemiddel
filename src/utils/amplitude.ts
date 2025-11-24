'use client'
import * as amplitude from '@amplitude/analytics-browser'
import { track } from '@amplitude/analytics-browser'

const APP_NAME = 'hm-oversikt-frontend'
const TEAM_NAME = 'teamdigihot'
const AMP_COLLECTION_URL = 'https://amplitude.nav.no/collect-auto'

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
  PAASKE = 'klikk på paaskepynt',
}

export enum nav_events {
  BESØK = 'besøk',
}

export const initAmplitude = (hostname: string) => {
  const apiKey = 'mock'


  if (apiKey != 'mock') {
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
        domain: hostname,
      },
    })
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
