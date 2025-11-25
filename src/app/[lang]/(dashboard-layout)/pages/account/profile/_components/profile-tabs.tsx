"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity } from "./tabs/activity"
import { CreatedCourses } from "./tabs/created-courses"
import { PersonalInformation } from "./tabs/personal-information"
import { PurchasedCourses } from "./tabs/purchased-courses"

export function ProfileTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "created"

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <section className="container p-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="p-6 w-fit mx-auto">
          <TabsTrigger className="p-2" value="created">
            Created Courses
          </TabsTrigger>
          <TabsTrigger className="p-2" value="personal">
            Personal Information
          </TabsTrigger>
          <TabsTrigger className="p-2" value="purchased">
            Purchased Courses
          </TabsTrigger>
          <TabsTrigger className="p-2" value="activity">
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          <CreatedCourses />
        </TabsContent>

        <TabsContent value="purchased">
          <PurchasedCourses />
        </TabsContent>

        <TabsContent value="personal">
          <PersonalInformation />
        </TabsContent>

        <TabsContent value="activity">
          <Activity />
        </TabsContent>
      </Tabs>
    </section>
  )
}
