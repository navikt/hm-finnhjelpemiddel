'use client'
import * as amplitude from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';

const APP_NAME = 'hm-oversikt'
const TEAM_NAME = 'teamdigihot'

/*export enum amplitude_taxonomy {
  SKJEMA_START = 'skjema startet',
  SKJEMA_ÅPEN = 'skjema åpnet',
  SKJEMASTEG_FULLFØRT = 'skjemasteg fullført',
  SKJEMAVALIDERING_FEILET = 'skjemavalidering feilet',
  SKJEMAINNSENDING_FEILET = 'skjemainnsending feilet',
  SKJEMA_FULLFØRT = 'skjema fullført',
  NAVIGERE = 'navigere',
}*/

export enum digihot_customevents {
  VISNING_OVERSIKT = 'visning av sider fra hm-oversikt-app',
  LEVERANDORPRODUKTER_KLIKKET_V2 = 'klikket på vis leverandørprodukter',
  NAVIGERE = 'navigere',
  KLIKK = 'klikk på knapp',
  ERROR_URL = 'feil ved url',
  VARIANTSIDE_VIST = 'visning av stor variantside',
}


export const initAmplitude = () => {
  const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY
  if (amplitude && apiKey) {
    amplitude.init(apiKey, undefined, {
/*      serverUrl: process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_URL,*/
      serverUrl: 'https://amplitude.nav.no/collect-auto',
      ingestionMetadata: {
        sourceName: window.location.toString()
      }
    });
/*    amplitude.getInstance().init('default', '', {
      apiEndpoint: 'amplitude.nav.no/collect-auto',
      saveEvents: false,
      includeUtm: true,
      includeReferrer: true,
      platform: window.location.toString(),
    })*/
  }
}

export function logAmplitudeEvent(eventName: string, data?: any) {
  setTimeout(() => {
    data = {
      app: APP_NAME ,
      team: TEAM_NAME,
      ...(data || {})
    }
    try {
      if (amplitude)  {
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
