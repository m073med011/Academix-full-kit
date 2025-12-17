"use client"

import { useEffect } from "react"
import { useCartStore } from "@/stores/cart-store"

/**
 * Hook to initialize cart on app load
 * Call this in your main layout component to load cart state
 */
export function useCartInit() {
  const initializeCart = useCartStore((state) => state.initializeCart)

  useEffect(() => {
    initializeCart()
  }, [initializeCart])
}
