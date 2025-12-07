"use client"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course } from "@/types/api"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseCurriculumTab } from "./course-curriculum-tab"
import { CourseInstructorTab } from "./course-instructor-tab"
import { CourseOverviewTab } from "./course-overview-tab"
import { CourseReviewsTab } from "./course-reviews-tab"

interface CourseTabsProps {
  dictionary: DictionaryType
  course: Course
}

export function CourseTabs({ dictionary, course }: CourseTabsProps) {
  const t = dictionary.courseDetailsPage?.tabs

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">{t?.overview || "Overview"}</TabsTrigger>
        <TabsTrigger value="curriculum">
          {t?.curriculum || "Curriculum"}
        </TabsTrigger>
        <TabsTrigger value="instructor">
          {t?.instructor || "Instructor"}
        </TabsTrigger>
        <TabsTrigger value="reviews">{t?.reviews || "Reviews"}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <CourseOverviewTab dictionary={dictionary} course={course} />
      </TabsContent>

      <TabsContent value="curriculum" className="mt-6">
        <CourseCurriculumTab dictionary={dictionary} course={course} />
      </TabsContent>

      <TabsContent value="instructor" className="mt-6">
        <CourseInstructorTab dictionary={dictionary} course={course} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <CourseReviewsTab dictionary={dictionary} course={course} />
      </TabsContent>
    </Tabs>
  )
}
