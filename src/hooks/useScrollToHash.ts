import { useEffect } from 'react'

/**
 * Scroller til elementet i URL-ens #hash når innholdet er rendret.
 * Trengs når innholdet lastes på klienten, fordi nettleseren prøver å hoppe til ankeret før elementet finnes.
 */
export default function useScrollToHash(items: unknown[]) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!items || items.length === 0) return

    const hash = window.location.hash
    if (!hash) return

    const id = hash.substring(1)
    const el = document.getElementById(id)
    if (!el) return

    window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, 0)
  }, [items])
}
