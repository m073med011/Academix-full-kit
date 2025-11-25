"use client"

import {
  Briefcase,
  Calendar,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PersonalInformation() {
  const userInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "user@example.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "New York, United States",
    },
    {
      icon: Calendar,
      label: "Joined",
      value: "January 2023",
    },
    {
      icon: Briefcase,
      label: "Occupation",
      value: "Senior Software Engineer",
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: "Master's in Computer Science",
    },
  ]

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {userInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                >
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {info.label}
                    </p>
                    <p className="text-base font-medium mt-1 break-words">
                      {info.value}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
