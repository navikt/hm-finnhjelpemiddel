'use client'

import { useEffect, useState } from 'react'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { AlternativeProduct } from '@/app/gjenbruksprodukter/alternative-util'

export enum CompareAlternativesMenuState {
  Open = 'Open',
  Minimized = 'Minimized',
}

type AlternativeProductCompareState = {
  compareAlternativesMenuState: CompareAlternativesMenuState
  setCompareAlternativesMenuState: (state: CompareAlternativesMenuState) => void
  alternativeProductsToCompare: AlternativeProduct[]
  setAlternativeProductToCompare: (product: AlternativeProduct) => void
  removeAlternativeProduct: (productId: string) => void
  resetAlternativeProductToCompare: () => void
}

export const useAlternativeProductCompareStore = create<AlternativeProductCompareState>()(
  persist(
    (set) => ({
      compareAlternativesMenuState: CompareAlternativesMenuState.Minimized,
      alternativeProductsToCompare: [],
      setCompareAlternativesMenuState: (menuState) => set(() => ({ compareAlternativesMenuState: menuState })),
      setAlternativeProductToCompare: (product) => {
        set((state) => ({ alternativeProductsToCompare: state.alternativeProductsToCompare.concat(product) }))
      },
      removeAlternativeProduct: (productId: string) =>
        set((state) => ({
          alternativeProductsToCompare: state.alternativeProductsToCompare.filter(
            (prod) => prod.variantId !== productId
          ),
        })),
      resetAlternativeProductToCompare: () => {
        set({ alternativeProductsToCompare: [] })
      },
    }),
    {
      name: 'compare-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

// This a fix to ensure zustand never hydrates the store before React hydrates the page
// otherwise it causes a mismatch between SSR and client render
// see: https://github.com/pmndrs/zustand/issues/1145
// https://github.com/TxnLab/use-wallet/pull/23/commits/f4c13aad62839500066d694a5b0f4a4c24c3c8d3
export const useHydratedAlternativeProductsCompareStore = (() => {
  const store = useAlternativeProductCompareStore()
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
    ? store
    : {
        compareAlternativesMenuState: CompareAlternativesMenuState.Minimized,
        alternativeProductsToCompare: [],
        setCompareAlternativesMenuState: () => undefined,
        setAlternativeProductToCompare: () => undefined,
        removeAlternativeProduct: () => undefined,
        resetAlternativeProductToCompare: () => undefined,
      }
}) as typeof useAlternativeProductCompareStore
