declare global {
  interface Window {
    SKYRA_CONFIG?: {
      org: string
      slug: string
      cookieConsent: boolean
    }
    skyra?: {
      setConsent: (consent: boolean) => void
      controller: {
        stop: () => void
      }
    }
    skyraSurvey?: object
  }
}
declare const window: typeof globalThis & Window

export const initSkyra = () => {
  window.SKYRA_CONFIG = {
    org: 'arbeids-og-velferdsetaten-nav',
    slug: 'arbeids-og-velferdsetaten-nav/DigiHoT-Finnhjelpemiddel_test_survey_v1',
    cookieConsent: true,
  }

  const script = document.createElement('script')
  script.src = 'https://survey.skyra.no/skyra-survey.js'
  script.async = true
  document.body.appendChild(script)
}

export const stopSkyra = () => {
  if (typeof window.skyra?.controller?.stop === 'function') {
    // Disable surveys by Skyra
    window.skyra.setConsent(false)
  }

  // Remove Skyra script from DOM
  const skyraScript = document.querySelector('script[src*="skyra-survey.js"]')

  if (window.SKYRA_CONFIG) {
    delete window.SKYRA_CONFIG
  }

  if (skyraScript) {
    skyraScript.remove()
  }

  // Remove Skyra object from window
  if (typeof window.skyra === 'object') {
    delete window.skyra
  }

  /*  if (typeof window.skyraSurvey === "object") {
      try {
        // @ts-ignore
          delete window.skyraSurvey;
        }
        catch (error) {
          console.error('Error destroying skyraSurvey:', error);
        }
    }*/
}
