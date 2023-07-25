'use client'

import { useEffect, useState } from 'react'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ProductWithVariants } from './product-util'

export enum CompareMenuState {
  Open = 'Open',
  Minimized = 'Minimized',
}

type ProductCompareState = {
  compareMenuState: CompareMenuState
  setCompareMenuState: (state: CompareMenuState) => void
  productsToCompare: ProductWithVariants[]
  setProductToCompare: (product: ProductWithVariants) => void
  removeProduct: (product: ProductWithVariants) => void
  resetProductToCompare: () => void
}

export const useProductCompareStore = create<ProductCompareState>()(
  persist(
    (set) => ({
      compareMenuState: CompareMenuState.Minimized,
      productsToCompare: [],
      setCompareMenuState: (menuState) => set(() => ({ compareMenuState: menuState })),
      setProductToCompare: (product) =>
        set((state) => ({ productsToCompare: state.productsToCompare.concat(product) })),
      removeProduct: (product) =>
        set((state) => ({ productsToCompare: state.productsToCompare.filter((prod) => prod.id !== product.id) })),
      resetProductToCompare: () => {
        set({ productsToCompare: [] })
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
export const useHydratedCompareStore = ((selector, compare) => {
  const store = useProductCompareStore(selector, compare)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
    ? store
    : {
        compareMenuState: CompareMenuState.Minimized,
        productsToCompare: [],
        setCompareMenuState: () => undefined,
        setProductToCompare: () => undefined,
        removeProduct: () => undefined,
        resetProductToCompare: () => undefined,
      }
}) as typeof useProductCompareStore
