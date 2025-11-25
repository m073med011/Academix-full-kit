"use client"

import Image from "next/image"

export function PurchasedCourses() {
  const courses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      image:
        "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&h=225&fit=crop",
      instructor: "John Smith",
      progress: 75,
    },
    {
      id: 2,
      title: "Advanced TypeScript Patterns",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
      instructor: "Sarah Johnson",
      progress: 45,
    },
    {
      id: 3,
      title: "UI/UX Design Principles",
      image:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=225&fit=crop",
      instructor: "Mike Chen",
      progress: 100,
    },
  ]

  return (
    <div className="mt-6">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col gap-3 pb-3 bg-card rounded-xl shadow-sm overflow-hidden border"
          >
            <div className="relative w-full aspect-video bg-muted">
              <Image
                src={course.image}
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
                by {course.instructor}
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
