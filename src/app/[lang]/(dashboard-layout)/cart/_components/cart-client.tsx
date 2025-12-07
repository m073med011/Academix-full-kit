"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  selectFinalPrice,
  selectItemCount,
  selectTotalPrice,
  useCartStore,
} from "@/stores/cart-store"
import { ArrowRight, ShoppingCart, Tag, X } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "./cart-item"

interface CartClientProps {
  dictionary: DictionaryType
}

export function CartClient({ dictionary }: CartClientProps) {
  const params = useParams()
  const router = useRouter()
  const locale = params.lang as LocaleType
  const t = dictionary.cartPage

  const cart = useCartStore((state) => state.cart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const clearCart = useCartStore((state) => state.clearCart)
  const isLoading = useCartStore((state) => state.isLoading)
  const refreshCart = useCartStore((state) => state.refreshCart)
  const discountCode = useCartStore((state) => state.discountCode)
  const discountAmount = useCartStore((state) => state.discountAmount)
  const discountError = useCartStore((state) => state.discountError)
  const applyDiscount = useCartStore((state) => state.applyDiscount)
  const removeDiscount = useCartStore((state) => state.removeDiscount)
  const totalPrice = useCartStore(selectTotalPrice)
  const finalPrice = useCartStore(selectFinalPrice)
  const itemCount = useCartStore(selectItemCount)

  const [codeInput, setCodeInput] = useState("")

  // Refresh cart when page loads
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const handleCheckout = () => {
    router.push(`/${locale}/checkout`)
  }

  const handleClearCart = async () => {
    if (confirm(t.clearCartConfirm)) {
      await clearCart()
    }
  }

  // Show loading state while cart is being fetched
  if (isLoading && !cart) {
    return (
      <div className="container max-w-6xl py-10">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">{t.loading}</p>
        </Card>
      </div>
    )
  }

  // Empty cart state
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container max-w-6xl py-10">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
        <Card className="p-12 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t.empty.title}</h2>
          <p className="text-muted-foreground mb-6">{t.empty.description}</p>
          <Button onClick={() => router.push(`/${locale}/public/store`)}>
            {t.empty.browseCourses}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <Button variant="ghost" onClick={handleClearCart} disabled={isLoading}>
          {t.clearCart}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem
              key={
                typeof item.courseId === "string"
                  ? item.courseId
                  : item.courseId._id
              }
              courseId={item.courseId}
              addedDate={item.addedDate}
              onRemove={removeFromCart}
              dictionary={dictionary}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">
              {t.orderSummary.title}
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t.orderSummary.items} ({itemCount})
                </span>
                <span>EGP {totalPrice.toFixed(2)}</span>
              </div>

              {/* Discount Code Section */}
              <div className="py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {t.orderSummary.discountCode}
                  </span>
                </div>

                {!discountCode ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder={t.orderSummary.enterCode}
                      value={codeInput}
                      onChange={(e) =>
                        setCodeInput(e.target.value.toUpperCase())
                      }
                      className="h-9"
                      disabled={isLoading}
                    />
                    <Button
                      size="sm"
                      onClick={() => applyDiscount(codeInput)}
                      disabled={!codeInput || isLoading}
                      className="px-4"
                    >
                      {t.orderSummary.apply}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 p-2 rounded-md">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        {discountCode}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-500">
                        -EGP {discountAmount.toFixed(2)} {t.orderSummary.saved}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeDiscount}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {discountError && (
                  <p className="text-xs text-red-500 mt-1">{discountError}</p>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                  <span>{t.orderSummary.discount}</span>
                  <span>-EGP {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>{t.orderSummary.total}</span>
                <span>EGP {finalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {t.checkout.button}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              {t.checkout.terms}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
