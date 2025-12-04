"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { paymentService } from "@/services/payment-service"
import { useCartStore } from "@/stores/cart-store"
import { usePurchasedCoursesStore } from "@/stores/purchased-courses-store"
import { toast } from "sonner"
import { CheckCircle, Loader2, XCircle } from "lucide-react"

import type { Payment } from "@/types/api"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const refreshCart = useCartStore((state) => state.refreshCart)
  const refreshPurchasedCourses = usePurchasedCoursesStore(
    (state) => state.refreshPurchasedCourses
  )
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  )
  const [paymentDetails, setPaymentDetails] = useState<Payment | null>(null)

  const paymentId = searchParams.get("paymentId")
  const paymentStatus = searchParams.get("status")
  const paymobSuccess = searchParams.get("success")
  const paymobPending = searchParams.get("pending")

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId) {
        setStatus("failed")
        toast.error("Invalid payment information")
        return
      }

      try {
        // Check if Paymob callback indicates success
        const isPaymobSuccess =
          paymobSuccess === "true" || paymentStatus === "success"
        const isPaymobPending = paymobPending === "true"

        if (isPaymobSuccess && !isPaymobPending) {
          // Payment was successful according to Paymob callback
          // Wait a bit for webhook to process
          await new Promise((resolve) => setTimeout(resolve, 2000))

          // Try to get payment details (webhook might have updated it)
          try {
            const payment = await paymentService.getPayment(paymentId)
            setPaymentDetails(payment)

            if (payment.status === "COMPLETED") {
              setStatus("success")
              toast.success(
                "Payment successful! You can now access your courses."
              )

              // Refresh cart to remove purchased items and update purchased courses
              await refreshCart()
              await refreshPurchasedCourses()

              // Redirect to purchased courses after 3 seconds
              setTimeout(() => {
                router.push("/courses/user/purchased")
              }, 3000)
              return
            }

            // If still pending, manually verify and complete payment
            if (payment.status === "PENDING") {
              console.log("Payment still pending, manually verifying...")
              const verifiedPayment =
                await paymentService.manuallyVerifyPayment(paymentId)
              setPaymentDetails(verifiedPayment)

              if (verifiedPayment.status === "COMPLETED") {
                setStatus("success")
                toast.success(
                  "Payment successful! You can now access your courses."
                )

                // Refresh cart to remove purchased items and update purchased courses
                await refreshCart()
                await refreshPurchasedCourses()

                setTimeout(() => {
                  router.push("/courses/user/purchased")
                }, 3000)
                return
              }
            }
          } catch (error) {
            console.error("Error processing payment:", error)
          }

          // If webhook hasn't processed yet, but Paymob says success, show success anyway
          setStatus("success")
          toast.success("Payment successful! Processing your enrollment...")

          // Refresh cart to remove purchased items and update purchased courses
          await refreshCart()
          await refreshPurchasedCourses()

          setTimeout(() => {
            router.push("/courses/user/purchased")
          }, 3000)
          return
        }

        // Get payment details
        const payment = await paymentService.getPayment(paymentId)
        setPaymentDetails(payment)

        if (payment.status === "COMPLETED") {
          setStatus("success")
          toast.success("Payment successful! You can now access your courses.")

          // Refresh cart to remove purchased items and update purchased courses
          await refreshCart()
          await refreshPurchasedCourses()

          // Redirect to purchased courses after 3 seconds
          setTimeout(() => {
            router.push("/courses/user/purchased")
          }, 3000)
        } else if (payment.status === "PENDING") {
          // Still processing - retry up to 5 times
          const retryCount = parseInt(
            sessionStorage.getItem("paymentRetryCount") || "0"
          )
          if (retryCount < 5) {
            sessionStorage.setItem("paymentRetryCount", String(retryCount + 1))
            setStatus("loading")
            setTimeout(() => verifyPayment(), 3000)
          } else {
            // Give up after 5 retries, assume webhook failed
            sessionStorage.removeItem("paymentRetryCount")
            if (isPaymobSuccess) {
              setStatus("success")
              toast.success(
                "Payment processed! Your courses will be available shortly."
              )

              // Refresh cart to remove purchased items and update purchased courses
              await refreshCart()
              await refreshPurchasedCourses()

              setTimeout(() => router.push("/courses/user/purchased"), 3000)
            } else {
              setStatus("failed")
              toast.error(
                "Payment verification timed out. Please contact support."
              )
            }
          }
        } else {
          setStatus("failed")
          toast.error("Payment failed. Please try again.")
        }
      } catch (error) {
        console.error("Payment verification error:", error)
        setStatus("failed")
        toast.error("Payment verification failed")
      }
    }

    verifyPayment()
  }, [
    paymentId,
    paymentStatus,
    paymobSuccess,
    paymobPending,
    router,
    refreshCart,
    refreshPurchasedCourses,
  ])

  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we verify your payment...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few moments
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold mb-2 text-green-600">
              Payment Successful!
            </h2>
            <p className="text-muted-foreground mb-4">
              Your courses have been activated.
            </p>
            {paymentDetails && (
              <div className="text-sm text-muted-foreground mb-6 space-y-1">
                <p>Payment ID: {paymentDetails._id}</p>
                {(paymentDetails.discountAmount || 0) > 0 && (
                  <>
                    <p>Original Amount: EGP {paymentDetails.originalAmount}</p>
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>
                        -${(paymentDetails.discountAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <p>Amount Paid: EGP {paymentDetails.amount}</p>
                <p>Courses: {paymentDetails.courseIds?.length || 0}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/courses/user/purchased")}>
                View My Courses
              </Button>
              <Button variant="outline" onClick={() => router.push("/courses")}>
                Browse More Courses
              </Button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2 text-red-600">
              Payment Failed
            </h2>
            <p className="text-muted-foreground mb-6">
              Something went wrong with your payment. Please try again.
            </p>
            {paymentDetails && (
              <div className="text-sm text-muted-foreground mb-6">
                <p>Payment ID: {paymentDetails._id}</p>
                <p>Status: {paymentDetails.status}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Button onClick={() => router.push("/checkout")}>
                Return to Checkout
              </Button>
              <Button variant="outline" onClick={() => router.push("/cart")}>
                View Cart
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
