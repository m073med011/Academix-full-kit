"use client"

import { useCartStore } from "@/stores/cart-store"
import { ShoppingCart } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CartSheet } from "./cart-sheet"

interface CartIconProps {
  dictionary: DictionaryType
}

/**
 * Cart icon with item count badge for header
 * Opens cart sidebar sheet when clicked
 * Automatically updates when cart changes
 */
export function CartIcon({ dictionary }: CartIconProps) {
  const cart = useCartStore((state) => state.cart)
  const isLoading = useCartStore((state) => state.isLoading)

  // Get item count from cart object directly
  const itemCount = cart?.itemCount ?? 0

  return (
    <CartSheet dictionary={dictionary}>
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && itemCount > 0 && (
          <Badge
            className="absolute -top-1 -end-1 h-4 max-w-8 flex justify-center"
            aria-live="polite"
            aria-atomic="true"
            role="status"
          >
            {itemCount > 9 ? "9+" : itemCount}
          </Badge>
        )}
        <span className="sr-only">Shopping Cart ({itemCount} items)</span>
      </Button>
    </CartSheet>
  )
}
