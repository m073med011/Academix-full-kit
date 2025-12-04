"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"

import type { Course } from "@/types/api"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CartItemProps {
  courseId: string | Course
  addedDate: string
  onRemove: (courseId: string) => void
}

/**
 * Cart item component displaying course details with remove button
 * Shows course image, title, description, level, duration, and price
 */
export function CartItem({
  courseId,
  addedDate: _addedDate,
  onRemove,
}: CartItemProps) {
  // Handle both string ID and populated Course object
  const course = typeof courseId === "string" ? null : courseId

  if (!course) {
    return null
  }

  const handleRemove = () => {
    const id = typeof courseId === "string" ? courseId : courseId._id
    onRemove(id)
  }

  return (
    <Card className="p-4">
      <div className="flex gap-4">
        {/* Course Thumbnail */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
          <Image
            src={
              course.thumbnailUrl || "https://placehold.co/600x400?text=Course"
            }
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Course Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">
                {course.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {course.description}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {course.level}
                </Badge>
                {course.duration && (
                  <span className="text-xs text-muted-foreground">
                    {course.duration} hours
                  </span>
                )}
              </div>
            </div>

            {/* Price and Remove Button */}
            <div className="flex flex-col items-end gap-2">
              <div className="text-lg font-bold">
                ${course.price.toFixed(2)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from cart</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
