"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { paymentService } from "@/services/payment-service"
import {
  selectItemCount,
  selectTotalPrice,
  useCartStore,
} from "@/stores/cart-store"
import { toast } from "sonner"
import { ArrowLeft, CreditCard, DollarSign, Wallet } from "lucide-react"

import type { LocaleType } from "@/types"
import type { BillingData } from "@/types/api"
import type { BillingFormValues } from "./_components/billing-form"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { BillingForm } from "./_components/billing-form"

type PaymentMethod = "card" | "wallet" | "cash"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const locale = params.lang as LocaleType

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const cart = useCartStore((state) => state.cart)
  const totalPrice = useCartStore(selectTotalPrice)
  const itemCount = useCartStore(selectItemCount)
  const clearCart = useCartStore((state) => state.clearCart)

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || itemCount === 0) {
      router.push(`/${locale}/cart`)
    }
  }, [cart, itemCount, locale, router])

  // Don't render if cart is empty
  if (!cart || itemCount === 0) {
    return null
  }

  const handlePayment = async (formData: BillingFormValues) => {
    setIsProcessing(true)
    try {
      const billingData: BillingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        street: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        apartment: "",
        floor: "",
        building: "",
        state: "",
      }

      const courseIds = cart.items.map((item) =>
        typeof item.courseId === "string" ? item.courseId : item.courseId._id
      )

      const response = await paymentService.initiateCheckout({
        courseIds,
        amount: totalPrice,
        paymentMethod,
        billingData,
      })

      if (response.paymobPaymentUrl) {
        window.location.href = response.paymobPaymentUrl
      } else if (response.success) {
        // If no payment URL (e.g. cash or free), redirect to confirmation
        await clearCart()
        router.push(
          `/${locale}/payment/success?paymentId=${response.payment._id}`
        )
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast.error("Payment initiation failed. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <div className="container max-w-6xl py-10">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Method Selection */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="card" id="card" />
                <Label
                  htmlFor="card"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Credit / Debit Card</div>
                    <div className="text-xs text-muted-foreground">
                      Pay securely with your card
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="wallet" id="wallet" />
                <Label
                  htmlFor="wallet"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Wallet className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Mobile Wallet</div>
                    <div className="text-xs text-muted-foreground">
                      Pay with Vodafone Cash, Orange Cash, etc.
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent">
                <RadioGroupItem value="cash" id="cash" />
                <Label
                  htmlFor="cash"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <DollarSign className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-xs text-muted-foreground">
                      Pay when you receive access
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </Card>

          {/* Billing Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
            <BillingForm onSubmit={handlePayment} isLoading={isProcessing} />
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Items ({itemCount})
                </span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Course List */}
            <div className="mt-6 pt-6 border-t space-y-3">
              <h3 className="font-medium text-sm text-muted-foreground">
                Courses in your order:
              </h3>
              {cart.items.map((item) => {
                const course =
                  typeof item.courseId !== "string" ? item.courseId : null
                if (!course) return null

                return (
                  <div key={course._id} className="text-sm">
                    <div className="font-medium line-clamp-1">
                      {course.title}
                    </div>
                    <div className="text-muted-foreground">
                      ${course.price.toFixed(2)}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
