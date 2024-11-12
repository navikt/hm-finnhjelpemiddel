'use client'
import * as amplitude from '@amplitude/analytics-browser';
import { track} from '@amplitude/analytics-browser';

const APP_NAME = 'hm-oversikt'
const TEAM_NAME = 'teamdigihot'
const AMPLITUDE_COLLECTION_URL = 'https://amplitude.nav.no/collect-auto'


type LogEvent = (params: { name: string; data?: any }) => void;

let amplitudeLogger: LogEvent | undefined = undefined;

function getApiKeyFromEnvironment() {
  switch (process.env.BUILD_ENV) {
    case "prod":
      return "10798841ebeba333b8ece6c046322d76";
    case "dev":
      return "c1c2553d689ba4716c7d7c4410b521f5";
    case "test":
      return "mock";
    default:
      return "mock";
  }
}

/*function getApiKeyFromEnvironment() {
  switch (process.env.BUILD_ENV) {
    case "production":
      return "10798841ebeba333b8ece6c046322d76";
    case "development":
      return "c1c2553d689ba4716c7d7c4410b521f5";
    default:
      return "mock";
  }
}*/

/*const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY*/

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
  const apiKey = getApiKeyFromEnvironment();
  console.log("apiKey", apiKey)
  if (apiKey === "mock") {
    amplitudeLogger = (params: { name: string; data?: any }) => {
/*      // eslint-disable-next-line no-console*/
      console.log("[Mock Amplitude Event]", {
        name: params.name,
        data: {
          ...("data" in params.data ? params.data.data : {}),
          ...params.data,
        },
      });
    };
  } else {
    amplitude.init(apiKey!, {
      serverUrl: AMPLITUDE_COLLECTION_URL,
      serverZone: "EU",
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
      },
    });
    amplitudeLogger = (params: { name: string; data?: any }) => {
      amplitude.logEvent(params.name, params.data);
    };
  }
}



/*export const initAmplitude = (): boolean => {
  const apiKey = getApiKeyFromEnvironment();
  try {
    console.log("initAmplitude called"); // New log statement
    init(apiKey, undefined, {
      serverZone: "EU",
      autocapture: {
        attribution: true,
        pageViews: true,
        sessions: true,
        formInteractions: true,
        fileDownloads: true,
        elementInteractions: true,
      },
    })
    console.log("Amplitude initialized")
    return true
  } catch (e) {
    console.error("Error initializing Amplitude", e)
    return false
  }
}*/

/*export const initAmplitude = () => {

  if (amplitude && apiKey) {
    amplitude.init(apiKey, undefined, {
/!*      serverUrl: process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_URL,*!/
      serverUrl: 'https://amplitude.nav.no/collect-auto',
      ingestionMetadata: {
        sourceName: window.location.toString()
      }
    });
/!*    amplitude.getInstance().init('default', '', {
      apiEndpoint: 'amplitude.nav.no/collect-auto',
      saveEvents: false,
      includeUtm: true,
      includeReferrer: true,
      platform: window.location.toString(),
    })*!/
  }
}*/

export function logAmplitudeEvent(eventName: string, data?: any) {
  setTimeout(() => {
    data = {
      app: APP_NAME ,
      team: TEAM_NAME,
      ...data
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
