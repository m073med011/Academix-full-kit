import { cartService } from "@/services/cart-service"
import { paymentService } from "@/services/payment-service"
import { toast } from "sonner"
import { create } from "zustand"

import type { CartWithCourses } from "@/types/api"

interface CartStore {
  cart: CartWithCourses | null
  isLoading: boolean
  isInitialized: boolean
  discountCode: string | null
  discountAmount: number
  discountError: string | null

  // Actions
  initializeCart: () => Promise<void>
  addToCart: (courseId: string) => Promise<void>
  removeFromCart: (courseId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  isInCart: (courseId: string) => boolean
  applyDiscount: (code: string) => Promise<void>
  removeDiscount: () => void
}

// Selectors for computed values
export const selectItemCount = (state: CartStore): number => {
  if (!state.cart || !state.cart.items) return 0
  return state.cart.items.length
}

export const selectTotalPrice = (state: CartStore): number => {
  const cart = state.cart
  if (!cart) return 0

  // Use pre-calculated totalPrice from CartWithCourses if available
  if ("totalPrice" in cart && typeof cart.totalPrice === "number") {
    console.log("Using pre-calculated totalPrice:", cart.totalPrice)
    return cart.totalPrice
  }

  // Fallback: calculate from items
  const calculated = cart.items.reduce((sum, item) => {
    // Check if course data is in the course property first
    const course =
      item.course || (typeof item.courseId !== "string" ? item.courseId : null)
    console.log("Item course:", course, "Price:", course?.price)
    return sum + (course?.price || 0)
  }, 0)
  console.log("Calculated totalPrice:", calculated)
  return calculated
}

export const selectFinalPrice = (state: CartStore): number => {
  const totalPrice = selectTotalPrice(state)
  return Math.max(0, totalPrice - state.discountAmount)
}

export const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  isInitialized: false,
  discountCode: null,
  discountAmount: 0,
  discountError: null,

  initializeCart: async () => {
    if (get().isInitialized) return

    try {
      set({ isLoading: true })
      const cartData = await cartService.getCart()
      console.log("Cart initialized:", cartData)
      set({ cart: cartData, isInitialized: true })
    } catch (error) {
      console.error("Failed to initialize cart:", error)
      set({ cart: null, isInitialized: true })
    } finally {
      set({ isLoading: false })
    }
  },

  refreshCart: async () => {
    try {
      set({ isLoading: true })
      const cartData = await cartService.getCart()
      console.log("Cart refreshed:", cartData)
      console.log("Cart items:", cartData?.items)
      console.log("Cart totalPrice from API:", cartData?.totalPrice)
      set({ cart: cartData })
    } catch (error) {
      console.error("Failed to fetch cart:", error)
      set({ cart: null })
    } finally {
      set({ isLoading: false })
    }
  },

  addToCart: async (courseId: string) => {
    try {
      set({ isLoading: true })
      console.log("Adding to cart:", courseId)
      await cartService.addToCart(courseId)
      await get().refreshCart()
      console.log("Cart after add:", get().cart)
      toast.success("Course added to cart")
    } catch (error) {
      console.error("Add to cart error:", error)
      // Display the actual error message from the backend
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add to cart"
      toast.error(errorMessage)
      set({ isLoading: false })
      throw error
    }
  },

  removeFromCart: async (courseId: string) => {
    try {
      set({ isLoading: true })
      await cartService.removeFromCart(courseId)
      await get().refreshCart()
      toast.success("Course removed from cart")
    } catch (error) {
      toast.error("Failed to remove from cart")
      set({ isLoading: false })
      throw error
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true })
      await cartService.clearCart()
      await get().refreshCart()
      toast.success("Cart cleared")
    } catch (error) {
      toast.error("Failed to clear cart")
      set({ isLoading: false })
      throw error
    }
  },

  isInCart: (courseId: string) => {
    const cart = get().cart
    if (!cart) return false
    return cart.items.some((item) =>
      typeof item.courseId === "string"
        ? item.courseId === courseId
        : item.courseId._id === courseId
    )
  },

  applyDiscount: async (code: string) => {
    const cart = get().cart
    if (!cart || cart.items.length === 0) {
      set({ discountError: "Cart is empty" })
      toast.error("Cart is empty")
      return
    }

    try {
      set({ isLoading: true, discountError: null })
      const courseIds = cart.items.map((item) =>
        typeof item.courseId === "string" ? item.courseId : item.courseId._id
      )

      const result = await paymentService.validateDiscountCode(code, courseIds)

      if (result.valid) {
        set({
          discountCode: code,
          discountAmount: result.discountAmount,
          discountError: null,
        })
        toast.success(`Discount applied: ${code}`)
      } else {
        set({
          discountCode: null,
          discountAmount: 0,
          discountError: result.message || "Invalid discount code",
        })
        toast.error(result.message || "Invalid discount code")
      }
    } catch (_error) {
      set({
        discountCode: null,
        discountAmount: 0,
        discountError: "Failed to apply discount",
      })
      toast.error("Failed to apply discount")
    } finally {
      set({ isLoading: false })
    }
  },

  removeDiscount: () => {
    set({
      discountCode: null,
      discountAmount: 0,
      discountError: null,
    })
    toast.success("Discount removed")
  },
}))
