import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'hm-agreement-favorites'

type FavoritesSet = Set<string>

const readFromStorage = (): FavoritesSet => {
  if (typeof window === 'undefined') {
    return new Set()
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()

    return new Set(parsed.filter((id) => typeof id === 'string'))
  } catch {
    return new Set()
  }
}

const writeToStorage = (favorites: FavoritesSet) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    const arr = Array.from(favorites)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
  } catch {
    // ignore storage write errors
  }
}

export const useAgreementFavorites = () => {
  const [favorites, setFavorites] = useState<FavoritesSet>(new Set())
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const initial = readFromStorage()
    setFavorites(initial)
    setIsReady(true)
  }, [])

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.has(id)
    },
    [favorites]
  )

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      writeToStorage(next)
      return next
    })
  }, [])

  return {
    favorites,
    isReady,
    isFavorite,
    toggleFavorite,
  }
}

