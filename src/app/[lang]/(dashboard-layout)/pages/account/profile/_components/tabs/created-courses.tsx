"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { courseService } from "@/app/[lang]/(dashboard-layout)/pages/account/courses/_services/course-service"
import { useSession } from "next-auth/react"
import { Loader2, Plus } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { LocaleType } from "@/types"
import type { Course } from "@/types/api"

import { ensureLocalizedPathname } from "@/lib/i18n"
import { typography } from "@/lib/typography"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DefaultImage } from "@/components/ui/defult-Image"

interface CreatedCoursesProps {
  dictionary: DictionaryType
}

export function CreatedCourses({ dictionary }: CreatedCoursesProps) {
  const params = useParams()
  const locale = params.lang as LocaleType
  const { data: session } = useSession()
  const t = dictionary.profilePage.createdCourses
  const tCreate = dictionary.profilePage.createCourse

  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await courseService.getCoursesByInstructor(session.user.id)
        setCourses(data)
      } catch (err) {
        console.error("Failed to fetch created courses:", err)
        setError("Failed to load courses")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [session?.user?.id])

  if (isLoading) {
    return (
      <div className="mt-6 flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-6 text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={typography.h4}>
            {dictionary.profilePage.tabs.createdCourses}
          </h2>
          <p className={typography.muted}>
            {courses.length} {courses.length === 1 ? "course" : "courses"}
          </p>
        </div>
        <Button asChild>
          <Link
            href={ensureLocalizedPathname(
              "/pages/account/courses/create",
              locale
            )}
          >
            <Plus className="size-4" />
            {tCreate.createNewCourse}
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">
            You haven't created any courses yet.
          </p>
          <Button asChild>
            <Link
              href={ensureLocalizedPathname(
                "/pages/account/courses/create",
                locale
              )}
            >
              <Plus className="size-4" />
              {tCreate.createNewCourse}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {courses.map((course) => (
            <Card
              key={course._id}
              asChild
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link
                href={ensureLocalizedPathname(
                  `/public/course/${course._id}`,
                  locale
                )}
              >
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <DefaultImage
                      src={course.thumbnailUrl}
                      alt={`Course thumbnail for ${course.title}`}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </CardContent>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base line-clamp-2">
                      {course.title}
                    </CardTitle>
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {course.isPublished ? t.published : t.draft}
                    </Badge>
                  </div>
                  <CardDescription>
                    {(course.students?.length || 0).toLocaleString()}{" "}
                    {t.students}
                  </CardDescription>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
