'use client'

export enum umami_customevents {
  BESØK = 'besøk',
  ERROR_URL = 'feil ved url',
  KLIKK = 'knapp klikket',
  NAVIGERE = 'navigere',
  VIS_FLERE_TREFF = 'vis flere treff',
  FILTER_ENDRET = 'filter-endret',
}

export const initUmami = (hostname: string) => {
  const UMAMI_TRACKING_ID_DEV = 'd2c4d342-5355-4dbc-9c0e-6d6498f4f4e1'
  const UMAMI_TRACKING_ID_PROD = '90c61615-5d2a-4195-a9ab-694b0aae94de'

  const UMAMI_WEBSITE_ID =
    process.env.BUILD_ENV === 'dev'
      ? UMAMI_TRACKING_ID_DEV
      : process.env.BUILD_ENV === 'prod'
        ? UMAMI_TRACKING_ID_PROD
        : '39d042d3-6a34-4c21-b409-3eca4699dc4a'

  const UMAMI_DATA_DOMAIN = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://umami.nav.no'
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

export function logUmamiEvent(eventName: string, data?: object) {
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

export function logUmamiCustomEvent(event: umami_customevents, data?: any) {
  logUmamiEvent(event, {
    ...data,
  })
}

export function logUmamiNavigationEvent(component: string, destination: string, linkText: string) {
  logUmamiCustomEvent(umami_customevents.NAVIGERE, {
    component: component,
    destination: destination,
    linkText: linkText,
  })
}

export function logUmamiFilterChangeEvent(component: string, filterType: string, filterValue: string) {
  logUmamiCustomEvent(umami_customevents.FILTER_ENDRET, {
    component: component,
    filterType: filterType,
    filterValue: filterValue,
  })
}


export function logUmamiClickButton(buttonName: string, buttonType: string, buttonVariant: string) {
  logUmamiCustomEvent(umami_customevents.KLIKK, {
    buttonName: buttonName,
    buttonType: buttonType,
    buttonVariant: buttonVariant,
  })
}

export function logUmamiVisit(url: string, pageTitle: string, pageType: string) {
  logUmamiEvent(umami_customevents.BESØK, {
    url: url,
    pageTitle: pageTitle,
    pageType: pageType,
  })
}

export function logUmamiErrorOnUrl(url: string) {
  logUmamiCustomEvent(umami_customevents.ERROR_URL, {
    url: url,
  })
}



/*
export function logUmamiShowMoreResult(component: string, extraInfo?: string) {
  logUmamiCustomEvent(umami_customevents.VIS_FLERE_TREFF)
}

export function logUmamiFilterEvent(filter: Record<string, string | string[]>, component: string) {
  logUmamiCustomEvent(umami_customevents.FILTRERING, {
    filter: filter,
    component: component,
  })
}


export function logUmamiActionEvent(action: string) {
  logUmamiCustomEvent(umami_customevents.ACTION, {
    action: action,
  })
}

export function logUmamiNavigationSearchEvent(
  component: string,
  destination: string,
  linkText: string,
  searchResultPlacement: number
) {
  logUmamiCustomEvent(umami_customevents.NAVIGERE, {
    component: component,
    destination: destination,
    linkText: linkText,
    searchResultPlacement: searchResultPlacement,
  })
}
*/
