'use client'

import { ALL_VARIANTS } from '@/app/sammenlign/compare-columns'

import { useEffect, useState } from 'react'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { Product } from '@/utils/product-util'

export enum CompareMenuState {
  Open = 'Open',
  Minimized = 'Minimized',
}

type ProductCompareState = {
  compareMenuState: CompareMenuState
  setCompareMenuState: (state: CompareMenuState) => void
  productsToCompare: Product[]
  setProductToCompare: (product: Product) => void
  removeProduct: (productId: string) => void
  resetProductToCompare: () => void
  /**
   * Valgte kolonner per produkt-id: variant-id-er og/eller ALL_VARIANTS ('alle').
   * Mangler produktet her, gjelder «Alle varianter» (produktet er lagt til med vanlig sammenlign-knapp).
   */
  variantSelections: Record<string, string[]>
  setVariantSelections: (productId: string, selections: string[]) => void
  /** Legger til eller fjerner én variant. Produktet legges til eller fjernes når det trengs. */
  toggleVariantToCompare: (product: Product, variantId: string) => void
}

export const MAX_PRODUCTS_TO_COMPARE = 5

export const useProductCompareStore = create<ProductCompareState>()(
  persist(
    (set) => ({
      compareMenuState: CompareMenuState.Minimized,
      productsToCompare: [],
      variantSelections: {},
      setCompareMenuState: (menuState) => set(() => ({ compareMenuState: menuState })),
      setProductToCompare: (product) => {
        set((state) => ({ productsToCompare: state.productsToCompare.concat(product) }))
      },
      removeProduct: (productId: string) =>
        set((state) => {
          const { [productId]: _removed, ...variantSelections } = state.variantSelections
          return {
            productsToCompare: state.productsToCompare.filter((prod) => prod.id !== productId),
            variantSelections,
          }
        }),
      resetProductToCompare: () => {
        set({ productsToCompare: [], variantSelections: {} })
      },
      setVariantSelections: (productId, selections) =>
        set((state) => ({ variantSelections: { ...state.variantSelections, [productId]: selections } })),
      toggleVariantToCompare: (product, variantId) =>
        set((state) => {
          const isInCompare = state.productsToCompare.some((prod) => prod.id === product.id)

          if (!isInCompare) {
            if (state.productsToCompare.length >= MAX_PRODUCTS_TO_COMPARE) return state
            // Nytt produkt: bare den valgte varianten, ikke «Alle varianter»
            return {
              productsToCompare: state.productsToCompare.concat(product),
              variantSelections: { ...state.variantSelections, [product.id]: [variantId] },
            }
          }

          const current = state.variantSelections[product.id] ?? [ALL_VARIANTS]
          const next = current.includes(variantId)
            ? current.filter((selection) => selection !== variantId)
            : [...current, variantId]

          if (next.length === 0) {
            // Siste valg fjernet: produktet går ut av sammenligningen
            const { [product.id]: _removed, ...variantSelections } = state.variantSelections
            return {
              productsToCompare: state.productsToCompare.filter((prod) => prod.id !== product.id),
              variantSelections,
            }
          }

          return { variantSelections: { ...state.variantSelections, [product.id]: next } }
        }),
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
export const useHydratedCompareStore = (() => {
  const store = useProductCompareStore()
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
        variantSelections: {},
        setVariantSelections: () => undefined,
        toggleVariantToCompare: () => undefined,
      }
}) as typeof useProductCompareStore

type MenuState = {
  isMenuOpen: boolean
  setMenuOpen(open: boolean): void
}

export const useMenuStore = create<MenuState>((set) => ({
  isMenuOpen: false,
  setMenuOpen: (open: boolean) =>
    set((state) => {
      if (open !== state.isMenuOpen) return { isMenuOpen: open }
      return state
    }),
}))

type MobileOverlayState = {
  isMobileOverlayOpen: boolean
  setMobileOverlayOpen(open: boolean): void
}

export const useMobileOverlayStore = create<MobileOverlayState>((set) => ({
  isMobileOverlayOpen: false,
  setMobileOverlayOpen: (open: boolean) =>
    set((state) => {
      if (open !== state.isMobileOverlayOpen) return { isMobileOverlayOpen: open }
      return state
    }),
}))
