import { RefObject, useEffect } from 'react'

export default function useOnClickOutside<T extends HTMLElement | null>(ref: RefObject<T>, onClickOutside: () => void) {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
        onClickOutside()
      }
    }
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })
}
