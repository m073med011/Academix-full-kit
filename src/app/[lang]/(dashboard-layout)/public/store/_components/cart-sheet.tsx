"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCartStore } from "@/stores/cart-store"
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react"

import type { LocaleType } from "@/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface CartSheetProps {
  children: React.ReactNode
}

/**
 * Cart sidebar sheet that displays cart items
 * Opens when clicking the cart icon trigger
 */
export function CartSheet({ children }: CartSheetProps) {
  const params = useParams()
  const locale = params.lang as LocaleType

  const cart = useCartStore((state) => state.cart)
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const isLoading = useCartStore((state) => state.isLoading)

  // Get values from cart object directly (calculated by cart service)
  const totalPrice = cart?.totalPrice ?? 0
  const itemCount = cart?.itemCount ?? 0

  const handleRemove = async (courseId: string) => {
    await removeFromCart(courseId)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Review your courses before checkout
          </SheetDescription>
        </SheetHeader>

        {/* Empty State */}
        {!cart || itemCount === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Start adding courses to your cart
            </p>
            <SheetTrigger asChild>
              <Button asChild>
                <Link href={`/${locale}/store`}>Browse Courses</Link>
              </Button>
            </SheetTrigger>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.items.map((item) => {
                  const course =
                    typeof item.courseId !== "string" ? item.courseId : null

                  if (!course) return null

                  return (
                    <div
                      key={course._id}
                      className="flex gap-3 p-3 rounded-lg border bg-card"
                    >
                      {/* Course Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={
                            course.thumbnailUrl ||
                            "https://placehold.co/600x400?text=Course"
                          }
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {course.level}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">
                            ${course.price.toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemove(course._id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            {/* Cart Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <SheetTrigger asChild>
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/${locale}/cart`}>
                    Go to Cart
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </SheetTrigger>

              <p className="text-xs text-center text-muted-foreground">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
