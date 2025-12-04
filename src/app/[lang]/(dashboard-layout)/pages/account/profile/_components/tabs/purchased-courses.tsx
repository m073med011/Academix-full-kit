"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePurchasedCoursesStore } from "@/stores/purchased-courses-store"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PurchasedCourses() {
  const { courses, isLoading, initializePurchasedCourses } =
    usePurchasedCoursesStore()

  useEffect(() => {
    initializePurchasedCourses()
  }, [initializePurchasedCourses])

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-lg font-medium mb-2">No purchased courses yet</p>
        <p className="text-muted-foreground mb-6">
          Start learning by browsing our course catalog
        </p>
        <Button asChild>
          <Link href="/public/store">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            href={`/public/course/${course._id}`}
            className="flex flex-col gap-3 pb-3 bg-card rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
          >
            <div className="relative w-full aspect-video bg-muted">
              <Image
                src={course.thumbnailUrl || "/placeholder-course.jpg"}
                alt={`Course thumbnail for ${course.title}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="px-4">
              <p className="text-base font-medium leading-normal line-clamp-2">
                {course.title}
              </p>
              <p className="text-muted-foreground text-sm font-normal leading-normal">
                {course.level} • {course.duration} hours
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">
                    {course.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {course.students?.length || 0} students
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
