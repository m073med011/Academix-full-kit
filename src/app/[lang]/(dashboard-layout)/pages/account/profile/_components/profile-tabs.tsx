"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { CardWithUnderlineTabs } from "@/app/[lang]/(dashboard-layout)/(design-system)/cards/basic/_components/card-with-underline-tabs"
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

  const tabs = [
    {
      value: "created",
      label: "Created Courses",
      content: <CreatedCourses />,
    },
    {
      value: "purchased",
      label: "Purchased Courses",
      content: <PurchasedCourses />,
    },
    {
      value: "personal",
      label: "Personal Information",
      content: <PersonalInformation />,
    },
    {
      value: "activity",
      label: "Activity",
      content: <Activity />,
    },
  ]

  return (
    <section className="py-2">
      <CardWithUnderlineTabs
        tabs={tabs}
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      />
    </section>
  )
}
