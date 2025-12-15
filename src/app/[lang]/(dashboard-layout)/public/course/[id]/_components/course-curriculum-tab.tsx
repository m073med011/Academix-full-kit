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

  // Calculate total lessons/items
  const totalItems =
    course.modules?.reduce(
      (acc, module) => acc + (module.items?.length || 0),
      0
    ) || 0

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">
          {t?.title || "Course Content"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {course.modules?.length || 0} {t?.sections || "sections"} •{" "}
          {totalItems} {t?.lessons || "lessons"} • {course.duration}{" "}
          {t?.totalLength || "hours total length"}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {course.modules?.map((module, index) => (
            <div
              key={module._id || index}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  {t?.sectionPrefix || "Section"} {index + 1}: {module.title}
                </h4>
                <span className="text-sm text-muted-foreground">
                  {module.items?.length || 0} {t?.lessons || "lessons"}
                </span>
              </div>
              <div className="space-y-2">
                {module.items?.map((item: any, itemIndex) => {
                  const material = item.materialId
                  return (
                    <div
                      key={item._id || itemIndex}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      {material?.type === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span>{material?.title || "Untitled Lesson"}</span>
                      <span className="ml-auto">
                        {material?.duration
                          ? `${material.duration} min`
                          : t?.reading || "Reading"}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          {(!course.modules || course.modules.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              No curriculum content available yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
