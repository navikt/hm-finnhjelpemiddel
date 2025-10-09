'use client'

export const initUmami = (hostname: string) => {
  const UMAMI_TRACKING_ID_DEV = 'd2c4d342-5355-4dbc-9c0e-6d6498f4f4e1'
  const UMAMI_TRACKING_ID_PROD = 'umami_prodid_to_be_set'

  const UMAMI_WEBSITE_ID =
    process.env.BUILD_ENV === 'dev'
      ? UMAMI_TRACKING_ID_DEV
      : process.env.BUILD_ENV === 'prod'
        ? UMAMI_TRACKING_ID_PROD
        : ''

  const UMAMI_DATA_DOMAIN = 'https://umami.nav.no'
  /*
  console.debug(
    `RUNTIME_ENVIRONMENT: ${process.env.RUNTIME_ENVIRONMENT},
    BUILD_ENV: ${process.env.BUILD_ENV},
    NODE_ENV: ${process.env.NODE_ENV},
    UMAMI_TRACKING_ID: ${process.env.UMAMI_TRACKING_ID},
    UMAMI_DATA_HOST_URL: ${process.env.UMAMI_DATA_HOST_URL}
    window.location.hostname: ${hostname}`
  )
*/

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
