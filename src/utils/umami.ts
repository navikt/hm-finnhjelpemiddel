'use client'

const UMAMI_DATA_HOST_URL: string =
  process.env.NODE_ENV !== 'production' || 'development'
    ? 'http://localhost:3000'
    : 'https://umami.nav.no'

const UMAMI_TRACKING_ID: string =
  process.env.NODE_ENV !== 'production' || 'development'
    ? '39d042d3-6a34-4c21-b409-3eca4699dc4a'
    : process.env.NODE_ENV === 'production'
      ? 'umami_prod_id'
      : 'd2c4d342-5355-4dbc-9c0e-6d6498f4f4e1'

export const initUmami = (hostname: string) => {
  // Ikke last Umami i lokalt miljø eller hvis det er deaktivert
  if (!UMAMI_DATA_HOST_URL) {
    console.debug('Umami er deaktivert eller ikke konfigurert, laster ikke sporing.')
    return
  }
  const script = document.createElement('script')
  script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
  script.defer = true
  script.setAttribute('data-host-url', `${UMAMI_DATA_HOST_URL}`)
  script.setAttribute('data-website-id', `${UMAMI_TRACKING_ID}`)
  script.setAttribute('data-auto-track', 'true')
  document.head.appendChild(script)
  console.debug('Umami er initialisert med website ID: ', UMAMI_TRACKING_ID)
}

export const stopUmami = () => {
  const umamiScript = document.querySelector('script[src="https://cdn.nav.no/team-researchops/sporing/sporing.js"]')

  if (umamiScript) {
    umamiScript.remove()
  }
}

