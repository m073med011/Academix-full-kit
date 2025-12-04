import type { Cart, CartWithCourses, Course } from "@/types/api"

import { ApiClientError, apiClient } from "@/lib/api-client"

// Cart service for client-side cart operations
export const cartService = {
  /**
   * Get user's cart with populated course data
   */
  async getCart(): Promise<CartWithCourses> {
    const response = await apiClient.get<Cart>("/cart")

    if (response.success && response.data) {
      const cart = response.data

      // Calculate totals from cart items
      let totalPrice = 0
      const itemCount = cart.items.length

      // Calculate total price from courses in cart
      cart.items.forEach((item) => {
        const course = typeof item.courseId !== "string" ? item.courseId : null
        if (course && "price" in course) {
          totalPrice += (course as Course).price
        }
      })

      return {
        ...cart,
        totalPrice,
        itemCount,
      } as CartWithCourses
    }

    throw new ApiClientError("Failed to fetch cart", 400)
  },

  /**
   * Add course to cart
   */
  async addToCart(courseId: string): Promise<Cart> {
    const response = await apiClient.post<Cart>("/cart/items", { courseId })

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to add to cart", 400)
  },

  /**
   * Remove course from cart
   */
  async removeFromCart(courseId: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`/cart/items/${courseId}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to remove from cart", 400)
  },

  /**
   * Remove multiple courses from cart
   */
  async removeMultipleItems(courseIds: string[]): Promise<Cart> {
    const response = await apiClient.delete<Cart>("/cart/items", {
      body: JSON.stringify({ courseIds }),
    })

    if (response.success && response.data) {
      return response.data
    }

    throw new ApiClientError("Failed to remove items from cart", 400)
  },

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const response = await apiClient.delete<void>("/cart")

    if (!response.success) {
      throw new ApiClientError("Failed to clear cart", 400)
    }
  },

  /**
   * Check if course is in cart
   */
  async isInCart(courseId: string): Promise<boolean> {
    try {
      const cart = await this.getCart()
      return cart.items.some((item) =>
        typeof item.courseId === "string"
          ? item.courseId === courseId
          : item.courseId._id === courseId
      )
    } catch {
      return false
    }
  },
}

export { ApiClientError }
