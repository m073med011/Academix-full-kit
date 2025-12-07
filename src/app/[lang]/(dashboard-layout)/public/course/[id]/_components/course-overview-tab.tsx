"use client"

import { CheckCircle, ChevronRight } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course } from "@/types/api"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CourseOverviewTabProps {
  dictionary: DictionaryType
  course: Course
}

export function CourseOverviewTab({
  dictionary,
  course,
}: CourseOverviewTabProps) {
  const t = dictionary.courseDetailsPage?.overview

  // Parse what you'll learn from description (for demo purposes)
  const learningPoints = [
    t?.learningPoints?.p1 || "Foundational principles of the subject",
    t?.learningPoints?.p2 || "Hands-on practical exercises and projects",
    t?.learningPoints?.p3 || "Industry best practices and standards",
    t?.learningPoints?.p4 || "Real-world application techniques",
    t?.learningPoints?.p5 || "Advanced concepts and methodologies",
    t?.learningPoints?.p6 || "Tools and technologies used by professionals",
  ]

  const prerequisites = [
    t?.prerequisites?.p1 || "Basic understanding of fundamental concepts",
    t?.prerequisites?.p2 || "Access to a computer with internet connection",
    t?.prerequisites?.p3 || "Willingness to learn and practice regularly",
  ]

  return (
    <div className="space-y-6">
      {/* What you'll learn */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {t?.whatYouLearn || "What you'll learn"}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learningPoints.map((point, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm font-normal">{point}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {t?.prerequisitesTitle || "Prerequisites"}
          </h3>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {prerequisites.map((prereq, index) => (
              <li key={index} className="flex gap-3">
                <ChevronRight className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-sm font-normal">{prereq}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Course Description */}
      <Card>
        <CardHeader>
          <h3 className="text-2xl font-semibold">
            {t?.descriptionTitle || "Course Description"}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground font-normal leading-relaxed">
            {course.description}
          </p>
          <p className="text-sm text-muted-foreground font-normal leading-relaxed mt-4">
            {`This comprehensive course is designed to take you from the
              fundamentals to advanced concepts in ${course.category}.
              Through a combination of video lectures, hands-on
              projects, and practical exercises, you'll gain the
              skills and knowledge needed to excel in this field.`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
