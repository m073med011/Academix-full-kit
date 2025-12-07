"use client"

import { useEffect } from "react"
import { useCartStore } from "@/stores/cart-store"
import { usePurchasedCoursesStore } from "@/stores/purchased-courses-store"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { ReactNode } from "react"

interface DictionarySyncProviderProps {
  dictionary: DictionaryType
  children: ReactNode
}

/**
 * This provider syncs the dictionary to all Zustand stores that need it.
 * This ensures that toasts and other notifications always use the correct
 * language based on the current locale, regardless of which page the user is on.
 */
export function DictionarySyncProvider({
  dictionary,
  children,
}: DictionarySyncProviderProps) {
  const setCartDictionary = useCartStore((state) => state.setDictionary)
  const setPurchasedDictionary = usePurchasedCoursesStore(
    (state) => state.setDictionary
  )

  // Sync dictionary to all stores whenever it changes
  useEffect(() => {
    setCartDictionary(dictionary)
    setPurchasedDictionary(dictionary)
  }, [dictionary, setCartDictionary, setPurchasedDictionary])

  return <>{children}</>
}
