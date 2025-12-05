"use client"

import Image from "next/image"

import type { DictionaryType } from "@/lib/get-dictionary"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CreatedCoursesProps {
  dictionary: DictionaryType
}

export function CreatedCourses({ dictionary }: CreatedCoursesProps) {
  const t = dictionary.profilePage.createdCourses

  const courses = [
    {
      id: 1,
      title: "Advanced Project Management",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop",
      status: "Published",
      statusKey: "published" as const,
      students: 1204,
    },
    {
      id: 2,
      title: "Data Security Basics",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop",
      status: "Draft",
      statusKey: "draft" as const,
      students: 0,
    },
    {
      id: 3,
      title: "Leadership & Communication",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      status: "Published",
      statusKey: "published" as const,
      students: 876,
    },
    {
      id: 4,
      title: "Software Development Lifecycle",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=225&fit=crop",
      status: "Published",
      statusKey: "published" as const,
      students: 2310,
    },
    {
      id: 5,
      title: "Marketing Fundamentals",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop",
      status: "Published",
      statusKey: "published" as const,
      students: 542,
    },
  ]

  return (
    <div className="mt-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                  src={course.image}
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
                  variant={
                    course.statusKey === "published" ? "default" : "secondary"
                  }
                  className="shrink-0"
                >
                  {t[course.statusKey]}
                </Badge>
              </div>
              <CardDescription>
                {course.students.toLocaleString()} {t.students}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
