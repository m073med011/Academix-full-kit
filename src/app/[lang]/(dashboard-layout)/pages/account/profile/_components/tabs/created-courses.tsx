"use client"

import Image from "next/image"

export function CreatedCourses() {
  const courses = [
    {
      id: 1,
      title: "Advanced Project Management",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=225&fit=crop",
      status: "Published",
      students: 1204,
    },
    {
      id: 2,
      title: "Data Security Basics",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop",
      status: "Draft",
      students: 0,
    },
    {
      id: 3,
      title: "Leadership & Communication",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
      status: "Published",
      students: 876,
    },
    {
      id: 4,
      title: "Software Development Lifecycle",
      image:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=225&fit=crop",
      status: "Published",
      students: 2310,
    },
    {
      id: 5,
      title: "Marketing Fundamentals",
      image:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop",
      status: "Published",
      students: 542,
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
                {course.status} • {course.students.toLocaleString()} students
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
