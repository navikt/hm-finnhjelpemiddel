'use client'
import { create } from 'zustand'
import { useState, useEffect } from 'react'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product } from './product-util'

export enum CompareMode {
  Active = 'Active',
  Inactive = 'Inactive',
}

export enum CompareMenuState {
  Open = 'Open',
  Minimized = 'Minimized',
}

type ProductCompareState = {
  compareMode: CompareMode
  setCompareMode: (mode: CompareMode) => void
  compareMenuState: CompareMenuState
  setCompareMenuState: (state: CompareMenuState) => void
  productsToCompare: Product[]
  setProductToCompare: (product: Product) => void
  removeProduct: (product: Product) => void
  resetProductToCompare: () => void
}

export const useProductCompareStore = create<ProductCompareState>()(
  persist(
    (set) => ({
      compareMode: CompareMode.Inactive,
      compareMenuState: CompareMenuState.Open,
      productsToCompare: [],
      setCompareMode: (mode) => set(() => ({ compareMode: mode })),
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
        compareMode: CompareMode.Inactive,
        compareMenuState: CompareMenuState.Minimized,
        productsToCompare: [],
        setCompareMode: () => undefined,
        setCompareMenuState: () => undefined,
        setProductToCompare: () => undefined,
        removeProduct: () => undefined,
        resetProductToCompare: () => undefined,
      }
}) as typeof useProductCompareStore
