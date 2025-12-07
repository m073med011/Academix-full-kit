"use client"

import { Users } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course, User } from "@/types/api"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CourseInstructorTabProps {
  dictionary: DictionaryType
  course: Course
}

// Helper to get instructor name
function getInstructorName(
  instructor: string | User | null | undefined
): string {
  if (!instructor) return "Unknown Instructor"
  if (typeof instructor === "string") return "Instructor"
  return instructor.name || "Unknown Instructor"
}

// Helper to get student count
function getStudentCount(students?: string[] | User[]): number {
  return students?.length || 0
}

export function CourseInstructorTab({
  dictionary,
  course,
}: CourseInstructorTabProps) {
  const t = dictionary.courseDetailsPage?.instructor

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {t?.title || "About the Instructor"}
        </h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-lg font-semibold">
                {getInstructorName(course.instructor)}
              </h4>
              <p className="text-sm text-primary">
                {`Expert ${course.category} Instructor`}
              </p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {`With over 10 years of experience in ${course.category},
                our instructor brings real-world expertise and
                practical knowledge to help you master the subject.
                They have taught thousands of students and are
                passionate about sharing their knowledge.`}
            </p>
            <div className="flex gap-6 text-sm">
              <div>
                <p className="font-semibold">
                  {getStudentCount(course.students).toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  {t?.studentsLabel || "Students"}
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  {course.rating?.toFixed(1) || "0.0"}
                </p>
                <p className="text-muted-foreground">
                  {t?.ratingLabel || "Rating"}
                </p>
              </div>
              <div>
                <p className="font-semibold">1</p>
                <p className="text-muted-foreground">
                  {t?.coursesLabel || "Courses"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
