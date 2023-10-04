import { useEffect, useState } from 'react'

import useDebounce from './useDebounce'

export default function useRestoreScroll(id: string, shouldRestore: boolean) {
  const [scrollTop, setScrollTop] = useState<Number>()
  const debouncedScrollTop = useDebounce(scrollTop, 100)
  const SESSION_STORAGE_ID = `restore-scroll-${id}`

  /**
   * Restore previous scroll position
   */
  useEffect(() => {
    try {
      if (shouldRestore) {
        console.log(
          'Restore previous scroll position, shoud restore:',
          shouldRestore,
          'stored value:',
          sessionStorage.getItem(SESSION_STORAGE_ID)
        )
        const storedValue = sessionStorage.getItem(SESSION_STORAGE_ID)
        if (storedValue) {
          window.scrollTo(0, parseInt(storedValue, 10))
        }
      }
    } catch (error) {
      // ignore sessionStorage error
      console.log(error)
    }
  }, [SESSION_STORAGE_ID, shouldRestore])
  /**
   * Listen to scroll event, and track current scroll position
   */
  useEffect(() => {
    try {
      if (shouldRestore) {
        function handleScroll() {
          setScrollTop(Math.round(window.scrollY || document.documentElement.scrollTop))
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
          window.removeEventListener('scroll', handleScroll)
        }
      }
    } catch (error) {
      // ignore sessionStorage error
    }
  }, [shouldRestore])
  /**
   * Store current scroll position
   */
  useEffect(() => {
    try {
      if (debouncedScrollTop !== undefined) {
        sessionStorage.setItem(SESSION_STORAGE_ID, `${debouncedScrollTop}`)
      }
    } catch (error) {
      // ignore sessionStorage error
    }
  }, [SESSION_STORAGE_ID, debouncedScrollTop])
}
