"use client"

import { Clock, Star, Users } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course, User } from "@/types/api"

import { Badge } from "@/components/ui/badge"

interface CourseHeaderProps {
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

export function CourseHeader({ dictionary, course }: CourseHeaderProps) {
  const t = dictionary.courseDetailsPage

  return (
    <div>
      <h1 className="text-4xl font-black mb-4">{course.title}</h1>
      <p className="text-sm text-muted-foreground font-normal mb-6">{course.description}</p>

      {/* Course Meta */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-1">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-base font-semibold">
            {course.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-sm text-muted-foreground font-normal">
            ({getStudentCount(course.students).toLocaleString()}{" "}
            {t?.students || "students"})
          </span>
        </div>
        <Badge variant="secondary" className="capitalize">
          {course.level}
        </Badge>
        <Badge variant="outline">{course.category}</Badge>
        <div className="flex items-center gap-1 text-sm text-muted-foreground font-normal">
          <Clock className="h-4 w-4" />
          <span>
            {course.duration} {t?.hours || "hours"}
          </span>
        </div>
      </div>

      {/* Instructor */}
      <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-normal">
            {t?.instructorLabel || "Instructor"}
          </p>
          <p className="text-base font-semibold">
            {getInstructorName(course.instructor)}
          </p>
        </div>
      </div>
    </div>
  )
}
