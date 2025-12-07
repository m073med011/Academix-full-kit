"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCartStore } from "@/stores/cart-store"
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2 } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"

import { i18n } from "@/configs/i18n"
import { typography } from "@/lib/typography"

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
  dictionary: DictionaryType
}

/**
 * Cart sidebar sheet that displays cart items
 * Opens when clicking the cart icon trigger
 */
export function CartSheet({ children, dictionary }: CartSheetProps) {
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

  const t = dictionary.storePage.cart
  const isRTL = i18n.localeDirection[locale] === "rtl"
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="w-full sm:max-w-lg flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t.title}
            {itemCount > 0 && (
              <Badge
                variant="secondary"
                className={isRTL ? "mr-auto" : "ml-auto"}
              >
                {itemCount} {itemCount === 1 ? t.item : t.items}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>{t.reviewCourses}</SheetDescription>
        </SheetHeader>

        {/* Empty State */}
        {!cart || itemCount === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className={`${typography.h4} mb-2`}>{t.emptyTitle}</h3>
            <p className={`${typography.muted} text-center mb-6`}>
              {t.emptyDescription}
            </p>
            <SheetTrigger asChild>
              <Button asChild>
                <Link href={`/${locale}/public/store`}>{t.browseCourses}</Link>
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
                      <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden">
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
                        <h4 className={`${typography.large} line-clamp-2 mb-1`}>
                          {course.title}
                        </h4>
                        <p
                          className={`${typography.small} text-muted-foreground mb-2`}
                        >
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
                            <span className="sr-only">{t.remove}</span>
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
              <div
                className={`flex items-center justify-between ${typography.h4}`}
              >
                <span>{t.total}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <SheetTrigger asChild>
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/${locale}/cart`}>
                    {t.goToCart}
                    <ArrowIcon
                      className={isRTL ? "mr-2 h-4 w-4" : "ml-2 h-4 w-4"}
                    />
                  </Link>
                </Button>
              </SheetTrigger>

              <p
                className={`${typography.small} text-center text-muted-foreground`}
              >
                {t.taxesShipping}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
