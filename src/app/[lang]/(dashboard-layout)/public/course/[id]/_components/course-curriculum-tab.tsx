"use client"

import { FileText, Video } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { Course } from "@/types/api"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CourseCurriculumTabProps {
  dictionary: DictionaryType
  course: Course
}

export function CourseCurriculumTab({
  dictionary,
  course,
}: CourseCurriculumTabProps) {
  const t = dictionary.courseDetailsPage?.curriculum

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {t?.title || "Course Content"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {course.materials?.length || 0} {t?.sections || "sections"} •{" "}
          {course.duration} {t?.totalLength || "hours total length"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((section) => (
            <div key={section} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  {t?.sectionPrefix || "Section"} {section}:{" "}
                  {t?.moduleTitle || "Module Title"}
                </h4>
                <span className="text-sm text-muted-foreground">
                  {Math.round(course.duration / 5)} {t?.hours || "hours"}
                </span>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((lesson) => (
                  <div
                    key={lesson}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    {lesson === 1 ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span>
                      {t?.lessonPrefix || "Lesson"} {lesson}:{" "}
                      {t?.topicName || "Topic Name"}
                    </span>
                    <span className="ml-auto">
                      {lesson === 1 ? "15:30" : t?.reading || "Reading"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
