'use client'

import { digihot_customevents, nav_events } from '@/utils/amplitude'

export const initUmami = (hostname: string) => {
  const UMAMI_TRACKING_ID_DEV = 'd2c4d342-5355-4dbc-9c0e-6d6498f4f4e1'
  const UMAMI_TRACKING_ID_PROD = '90c61615-5d2a-4195-a9ab-694b0aae94de'

  const UMAMI_WEBSITE_ID =
    process.env.BUILD_ENV === 'dev' || 'local'
      ? UMAMI_TRACKING_ID_DEV
      : process.env.BUILD_ENV === 'prod'
        ? UMAMI_TRACKING_ID_PROD
        : ''

  const UMAMI_DATA_DOMAIN = 'https://umami.nav.no'
  console.debug(
    `RUNTIME_ENVIRONMENT: ${process.env.RUNTIME_ENVIRONMENT},
    BUILD_ENV: ${process.env.BUILD_ENV},
    NODE_ENV: ${process.env.NODE_ENV},
    UMAMI_TRACKING_ID: ${process.env.UMAMI_TRACKING_ID},
    UMAMI_DATA_HOST_URL: ${process.env.UMAMI_DATA_HOST_URL}
    window.location.hostname: ${hostname}`
  )

  // Ikke last Umami i lokalt miljø eller hvis det er deaktivert
  if (!UMAMI_WEBSITE_ID) {
    console.debug('Umami er deaktivert eller ikke konfigurert, laster ikke sporing.')
    return
  }
  const script = document.createElement('script')
  script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
  script.defer = true
  script.setAttribute('data-host-url', `${UMAMI_DATA_DOMAIN}`)
  script.setAttribute('data-website-id', `${UMAMI_WEBSITE_ID}`)
  script.setAttribute('data-auto-track', 'true')
  document.head.appendChild(script)
  console.debug(`Umami er initialisert med website ID: ${UMAMI_WEBSITE_ID} og data_domain: ${UMAMI_DATA_DOMAIN}`)
}

export const stopUmami = () => {
  const umamiScript = document.querySelector('script[src="https://cdn.nav.no/team-researchops/sporing/sporing.js"]')

  if (umamiScript) {
    umamiScript.remove()
  }
}

export function logUmamiEvent(eventName: string, data?: any) {
  const umamiScript = document.querySelector('script[src="https://cdn.nav.no/team-researchops/sporing/sporing.js"]')
  setTimeout(() => {
    data = {
/*      app: APP_NAME,
      team: TEAM_NAME,*/
      ...data,
    }
    try {
      if (umamiScript) {
        umami.track(eventName, data)
      }
    } catch (error) {
      console.error(error)
    }
  })
}

export function logUmamiCustomEvent(event: digihot_customevents, data?: any) {
  logUmamiEvent(event, {
    ...data,
  })
}

export function logUmamiNavigationEvent(komponent: string, destinasjon: string, lenketekst: string) {
  logUmamiCustomEvent(digihot_customevents.NAVIGERE, {
    komponent: komponent,
    destinasjon: destinasjon,
    lenketekst: lenketekst,
  })
}

export function logUmamiNavigationSearchEvent(
  komponent: string,
  destinasjon: string,
  lenketekst: string,
  søkeresultatplassering: number
) {
  logUmamiCustomEvent(digihot_customevents.NAVIGERE, {
    komponent: komponent,
    destinasjon: destinasjon,
    lenketekst: lenketekst,
    søkeresultatplassering: søkeresultatplassering,
  })
}

export function logUmamiActionEvent(handling: string) {
  logUmamiCustomEvent(digihot_customevents.ACTION, {
    handling: handling,
  })
}

export function logUmamiFilterEvent(filter: Record<string, string | string[]>, komponent: string) {
  logUmamiCustomEvent(digihot_customevents.FILTRERING, {
    filter: filter,
    komponent: komponent,
  })
}

export function logUmamiFilterEndretEvent(komponent: string) {
  logUmamiCustomEvent(digihot_customevents.FILTER_ENDRET, {
    komponent: komponent,
  })
}

export function logUmamiVisFlereTreff() {
  logUmamiCustomEvent(digihot_customevents.VIS_FLERE_TREFF)
}

export function logUmamiLeverandorprodukterKlikket() {
  logUmamiCustomEvent(digihot_customevents.LEVERANDORPRODUKTER_KLIKKET_V2)
}

export function logUmamiVariantSideVist() {
  logUmamiCustomEvent(digihot_customevents.VARIANTSIDE_VIST)
}

export function logUmamiKlikk(buttonName: string) {
  logUmamiCustomEvent(digihot_customevents.KLIKK, {
    buttonName: buttonName,
  })
}

export function logUmamiErrorOnUrl(url: string) {
  logUmamiCustomEvent(digihot_customevents.ERROR_URL, {
    url: url,
  })
}

export function logUmamiVisit(url: string, sidetittel: string, sidetype: string) {
  logUmamiEvent(nav_events.BESØK, {
    url: url,
    sidetittel: sidetittel,
    sidetype: sidetype,
  })
}
