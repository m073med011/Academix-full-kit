"use client"

import { Star, Users } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course, User } from "@/types/api"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CourseReviewsTabProps {
  dictionary: DictionaryType
  course: Course
}

// Helper to get student count
function getStudentCount(students?: string[] | User[]): number {
  return students?.length || 0
}

export function CourseReviewsTab({
  dictionary,
  course,
}: CourseReviewsTabProps) {
  const t = dictionary.courseDetailsPage?.reviews

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {t?.title || "Student Reviews"}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {course.rating?.toFixed(1) || "0.0"}
              </p>
              <div className="flex gap-0.5 my-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(course.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {getStudentCount(course.students)} {t?.ratings || "ratings"}
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{
                        width: `${
                          rating === 5
                            ? 60
                            : rating === 4
                              ? 25
                              : rating === 3
                                ? 10
                                : rating === 2
                                  ? 3
                                  : 2
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-10 text-right">
                    {rating === 5
                      ? "60"
                      : rating === 4
                        ? "25"
                        : rating === 3
                          ? "10"
                          : rating === 2
                            ? "3"
                            : "2"}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sample Reviews */}
          <div className="space-y-4">
            {[1, 2, 3].map((review) => (
              <div key={review} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">
                        {t?.studentName || "Student Name"}
                      </p>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-3 w-3 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t?.weeksAgo?.replace("{count}", "2") || "2 weeks ago"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {`Excellent course! The instructor explains
                        concepts clearly and the practical exercises
                        really helped me understand the material.
                        Highly recommended for anyone looking to learn ${course.category}.`}
                    </p>
                  </div>
                </div>
                {review < 3 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
