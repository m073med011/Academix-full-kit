"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function Activity() {
  const activities = [
    {
      id: 1,
      type: "course_completed",
      title: "Completed UI/UX Design Principles",
      time: "2 hours ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    {
      id: 2,
      type: "course_enrolled",
      title: "Enrolled in Advanced TypeScript Patterns",
      time: "1 day ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    {
      id: 3,
      type: "course_published",
      title: "Published new course: Software Development Lifecycle",
      time: "3 days ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    {
      id: 4,
      type: "achievement",
      title: "Earned 'Master Instructor' badge",
      time: "1 week ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
    {
      id: 5,
      type: "milestone",
      title: "Reached 5,000 total students",
      time: "2 weeks ago",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    },
  ]

  return (
    <div className="mt-6">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <Avatar className="size-10">
                  <AvatarImage src={activity.avatar} alt="Activity icon" />
                  <AvatarFallback>{activity.id}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
