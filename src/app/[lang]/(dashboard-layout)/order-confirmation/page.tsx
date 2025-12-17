"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { paymentService } from "@/app/[lang]/(dashboard-layout)/checkout/_services/payment-service"
import { ArrowRight, CheckCircle, Package } from "lucide-react"

import type { LocaleType } from "@/types"
import type { Payment } from "@/types/api"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function OrderConfirmationContent() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = params.lang as LocaleType

  const [payment, setPayment] = useState<Payment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get("paymentId") || searchParams.get("orderId")

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!orderId) {
        setIsLoading(false)
        return
      }

      try {
        const paymentData = await paymentService.getPayment(orderId)
        setPayment(paymentData)
      } catch (error) {
        console.error("Failed to fetch payment details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentDetails()
  }, [orderId])

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <Package className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!orderId || !payment) {
    return (
      <div className="container max-w-2xl py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          We couldn&apos;t find your order details. Please check your email for
          confirmation.
        </p>
        <Button onClick={() => router.push(`/${locale}/courses`)}>
          Browse Courses
        </Button>
      </div>
    )
  }

  const isSuccess = payment.status === "success"

  return (
    <div className="container max-w-2xl py-10">
      <Card className="p-8 text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. Your courses are now available in
              your library.
            </p>
          </>
        ) : (
          <>
            <Package className="h-16 w-16 mx-auto text-orange-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Order Received</h1>
            <p className="text-muted-foreground mb-6">
              Your order has been received and is being processed.
            </p>
          </>
        )}

        <Separator className="my-6" />

        {/* Order Details */}
        <div className="space-y-4 text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-medium">
              {payment.paymobOrderId || payment._id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Status</span>
            <span
              className={`font-medium capitalize ${
                isSuccess
                  ? "text-green-600"
                  : payment.status === "pending"
                    ? "text-orange-600"
                    : "text-red-600"
              }`}
            >
              {payment.status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium capitalize">
              {payment.paymentMethod.replace("_", " ")}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Amount</span>
            <span>${payment.amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-8">
          {isSuccess && (
            <Button
              size="lg"
              onClick={() => router.push(`/${locale}/my-courses`)}
            >
              Go to My Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/courses`)}
          >
            Continue Shopping
          </Button>
        </div>

        {/* Email Confirmation Notice */}
        <p className="text-xs text-muted-foreground mt-6">
          A confirmation email has been sent to your registered email address.
        </p>
      </Card>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-2xl py-20 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  )
}
